-- Custom SQL migration file, put your code below! --
with cte as (
  select id, "updatedAt", "createdAt" from "SplendorRoom" where started is true
)
update "SplendorGame" as g set "updatedAt" = cte."updatedAt", "createdAt" = cte."createdAt" from cte where cte.id = g.id;
