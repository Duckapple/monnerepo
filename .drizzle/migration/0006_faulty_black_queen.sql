-- Custom SQL migration file, put your code below! --
with cte as (
  select id, "updatedAt", "createdAt" from "SplendorRoom" where started is true
)
update "SplendorGame" as g set "updatedAt" = cte."updatedAt", "createdAt" = cte."createdAt" from cte where cte.id = g.id;

insert into "Lobby" select substr(id::text, 1, 6) as code, 'splendor'::"GameType", "createdAt" as gameType from "SplendorRoom" where started is false;

insert into "LobbyParticipant"
  select
    substr(r.id::text, 1, 6) as "code",
    p."userId",
    now() as joinedAt,
    r."ownerId" = p."userId" as "owner"
  from "SplendorRoom" r
    left join "SplendorGamePlayer" p
      on p."gameId" = r.id
  where started is false;
