<script lang="ts">
	import { Button } from '@sgk/lib/ui';
	import Piece from '$lib/components/piece.svelte';
	import { onMount } from 'svelte';

	const PAWN_SIZE = 96;
	const OFFSET = 300;
	const CENTERED_OFFSET = OFFSET - PAWN_SIZE / 2;

	interface Transform {
		id: number;
		x: number;
		y: number;
		sX: number;
		sY: number;
		r: number;
	}

	const pawns = $state<Transform[]>([]);
	let selectedIndex = $state(0);

	let canvas = $state<HTMLElement>();

	let initial = $state<{ x: number; y: number; mode: 'move' | 'rotate' }>();
	let movement = $state<{ x: number; y: number }>();
	let rotation = $state<{ r: number }>();

	function selectNearest(x: number, y: number) {
		x -= OFFSET;
		y -= OFFSET;
		const best = { v: Infinity, id: null as null | number };
		for (const pawn of pawns) {
			const dist = (x - pawn.x) ** 2 + (y - pawn.y) ** 2;
			if (dist < best.v) {
				best.v = dist;
				best.id = pawn.id;
			}
		}
		if (typeof best.id !== 'number' || best.v > 3000) return;
		selectedIndex = best.id;
	}

	onMount(() => {
		function down(e: PointerEvent) {
			if (!pawns[selectedIndex] || e.target !== canvas) return;
			initial = { x: e.layerX, y: e.layerY, mode: 'move' };
		}
		function move(e: PointerEvent) {
			if (initial?.mode === 'rotate') {
				const pointerFromCenter = { x: e.layerX - initial.x, y: e.layerY - initial.y };
				const len = Math.sqrt(pointerFromCenter.x ** 2 + pointerFromCenter.y ** 2);

				rotation = {
					r: Math.round(
						Math.sign(pointerFromCenter.x / len) *
							(1 - Math.acos(pointerFromCenter.y / len) / Math.PI) *
							180
					),
				};
			} else if (initial?.mode === 'move') {
				movement = { x: e.layerX - initial.x, y: e.layerY - initial.y };
			}
		}
		function up() {
			const { x, y, mode } = initial ?? {};
			initial = undefined;
			if (!movement && !rotation) {
				if (typeof x !== 'number' || typeof y !== 'number') return;
				return selectNearest(x, y);
			}
			const selected = pawns[selectedIndex];
			if (!selected) return;

			if (mode === 'move') {
				selected.x += movement?.x ?? selected.x;
				selected.y += movement?.y ?? selected.y;
				movement = undefined;
			} else if (mode === 'rotate') {
				selected.r = rotation?.r ?? selected.r;
				rotation = undefined;
			}
		}
		canvas?.addEventListener('pointerdown', down);
		canvas?.addEventListener('pointermove', move);
		canvas?.addEventListener('pointerup', up);
		return () => {
			canvas?.removeEventListener('pointerdown', down);
			canvas?.removeEventListener('pointermove', move);
			canvas?.removeEventListener('pointerup', up);
		};
	});
</script>

<Button
	onclick={() => {
		pawns.push({ id: pawns.length, x: 0, y: 0, r: 0, sX: 1, sY: 1 });
		selectedIndex = pawns.length - 1;
	}}
>
	Add pawn
</Button>

<div class="flex h-150">
	<div class="relative h-150 w-150 border border-slate-500 text-red-600" bind:this={canvas}>
		{#each pawns as pawn, i (i)}
			{@const pawnMovement = selectedIndex === i ? movement : null}
			{@const pawnRotation = selectedIndex === i ? rotation : null}
			<div
				class={[
					'pointer-events-none absolute top-0 left-0 -m-px border border-dashed',
					selectedIndex === i ? 'border-slate-500' : 'border-transparent',
				]}
				style="transform:
				  translate(
						{pawn.x + (pawnMovement?.x ?? 0) + CENTERED_OFFSET}px,
						{pawn.y + (pawnMovement?.y ?? 0) + CENTERED_OFFSET}px)
						rotate({pawnRotation?.r ?? pawn.r}deg)
					"
			>
				<Piece class="size-24">
					<div
						class="absolute -top-6 left-1/2 -ml-1 size-2 cursor-crosshair rounded-full border border-red-500"
						class:hidden={selectedIndex !== i}
						class:pointer-events-auto={!initial}
						onpointerdown={() => {
							// const x = HANDLE_DIST * Math.sin((pawn.r * Math.PI) / 180);
							// const y = -HANDLE_DIST * Math.cos((pawn.r * Math.PI) / 180);
							initial = { x: pawn.x + OFFSET, y: pawn.y + OFFSET, mode: 'rotate' };
							console.log($state.snapshot(initial));
						}}
					></div>
				</Piece>
			</div>
		{/each}
	</div>
	<ul class="max-h-full shrink overflow-y-auto">
		{#each pawns as pawn, i (i)}
			<li>
				<label>
					<input type="radio" value={i} bind:group={selectedIndex} />
					Pawn #{i}
				</label>
				<input bind:value={pawn.x} type="number" class="w-14 border border-slate-500" />
				<input bind:value={pawn.y} type="number" class="w-14 border border-slate-500" />
				<input
					bind:value={pawn.r}
					min="-180"
					max="180"
					type="number"
					class="w-14 border border-slate-500"
				/>
			</li>
		{/each}
	</ul>
</div>
