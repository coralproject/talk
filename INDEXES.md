# Indexes

## 2022-01-17

`db.commentActions.createIndex({ tenantID: 1, actionType: 1, createdAt: 1 }, { partialFilterExpression: { actionType: "FLAG" } });`

## 2021-12-17

`db.sites.createIndex({ tenantID: 1, "$**": "text", createdAt: -1 });`
