# Indexes

## 2022-01-17

```
db.commentActions.createIndex({ tenantID: 1, actionType: 1, createdAt: 1 }, { partialFilterExpression: { actionType: "FLAG" } });
```

## 2021-12-17

```
db.sites.createIndex({ tenantID: 1, "$**": "text", createdAt: -1 });
```

## Existing Indexes prior to start of `INDEXES.md`

### commentActions:

#### uniqueness constraint indexes:

```
db.commentActions.createIndex({ _id: 1 }); 
db.commentActions.createIndex({ tenantID: 1, id: 1 });
```

#### Other indexes:
```
db.commentActions.createIndex({ tenantID: 1, actionType: 1, commentID: 1, userID: 1 });
db.commentActions.createIndex({ tenantID: 1, actionType: 1, commentID: 1, createdAt: -1 });
db.commentActions.createIndex({ commentID: 1, tenantID: 1, createdAt: 1 });
db.commentActions.createIndex({ tenantID:1, userID:1, commentID:1});
db.commentActions.createIndex({ tenantID: 1, siteID: 1 });
```

### commentModerationActions:

#### Uniqueness constraint indexes:

```
db.commentModerationActions.createIndex({ _id: 1 });
db.commentModerationActions.createIndex({ tenantID: 1, id: 1 });
```

#### Other indexes:
```
db.commentModerationActions.createIndex({ tenantID: 1, commentID: 1, createdAt: -1 });
db.commentModerationActions.createIndex({ moderatorID: 1, tenantID: 1, createdAt: -1 });
```

### comments

#### Uniqueness constraint indexes:

```
db.comments.createIndex({ _id: 1 });
db.comments.createIndex({ tenantID: 1, id: 1 });
```

#### Other indexes:
```
db.comments.createIndex({ authorID: 1, tenantID: 1, createdAt: 1 });
db.comments.createIndex({ siteID: 1, tenantID: 1, createdAt: 1 });
db.comments.createIndex({ siteID: 1, tenantID: 1, status: 1, createdAt: 1 });
db.comments.createIndex({ status: 1, tenantID: 1, createdAt: 1 });
db.comments.createIndex({storyID: 1,parentID: 1,tenantID: 1,status: 1,'actionCounts.REACTION': -1,createdAt: -1});
db.comments.createIndex({ storyID: 1, tenantID: 1, createdAt: 1 });
db.comments.createIndex({ storyID: 1,tenantID: 1,status: 1,childCount: -1,createdAt: -1});
db.comments.createIndex({ storyID: 1, tenantID: 1, 'tags.type': 1, createdAt: 1 });
db.comments.createIndex({ tenantID: 1, storyID: 1, 'tags.type': 1, status: 1 }, { partialFilterExpression: { 'tags.type': { '$exists': true } } });
db.comments.createIndex({tenantID: 1,storyID: 1,parentID: 1,status: 1,childCount: -1,createdAt: -1});
db.comments.createIndex({ tenantID: 1, status: 1, createdAt: 1 }, { partialFilterExpression: { 'actionCounts.FLAG': { '$gt': 0 } } });
```

```
db.comments.createIndex({ storyID: 1,tenantID: 1,'tags.type': 1,'actionCounts.REACTION': -1,createdAt: -1});
```
  - NOTE: is this a partial filter index?

```
db.comments.createIndex({ storyID: 1, parentID: 1, tenantID: 1, status: 1, createdAt: 1 });
```
  - NOTE: want to keep null parentIDs in index because queries are matching on null
