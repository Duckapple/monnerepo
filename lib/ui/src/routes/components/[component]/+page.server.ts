import { parse } from 'svelte/compiler';
import { walk } from 'estree-walker';

export async function load({ params: { component } }) {
	if (component.includes('..')) return { component: '', params: [] };

	const fileName = component.toLowerCase();
	const file = Bun.file(`./src/lib/${fileName}/${fileName}.svelte`);

	if (!file.exists()) return { component: '', params: [] };

	const ast = parse(await file.text(), { modern: true });
	// Bun.file('./ast.json').write(JSON.stringify(ast, null, 2));
	console.dir(ast, { depth: Infinity });

	const params: { key: string; defaultValue?: any; options?: string[] }[] = [];

	let isProps = false;
	walk(ast, {
		enter(node) {
			if (node.type === 'TSInterfaceDeclaration') {
				isProps = !!node.id?.name?.includes('Props');
			}
			if (node.type === 'TSPropertySignature' && isProps) {
				const key = node.key.name;
				const param: (typeof params)[number] = { key };
				const type = node.typeAnnotation.typeAnnotation;

				switch (type.type) {
					case 'TSUnionType':
						param.options = type.types.map((x) => x.literal?.value).filter(Boolean);
						break;
				}

				const [defaultType, ...value]: string[] =
					node.trailingComments?.[0]?.value?.trim().split(':') ?? [];

				switch (defaultType) {
					case 'string':
						param.defaultValue = value.join(':');
						break;
					case 'boolean':
						param.defaultValue = value[0] === 'true';
						break;
				}

				params.push(param);

				console.log(key, type.type);
			}
		}
		// leave(node) {
		// 	// console.log('Leaving:', node.type);
		// }
	});

	console.log(params);

	return { params, component };
}
