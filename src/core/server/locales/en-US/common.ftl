closeCommentingDefaultMessage = Comments are closed on this story.
disableCommentingDefaultMessage = Comments are closed on this story.

reaction-labelRespect = Respect
reaction-labelActiveRespected = Respected
reaction-sortLabelMostRespected = Most Respected

comment-count =
  <span class="{ $numberClass }">{ $number }</span>
  <span class="{ $textClass }">{ $number  ->
    [one] Comment
    *[other] Comments
  }</span>

comment-counts-ratings-and-review =
  <span class="{ $numberClass }">{ $number }</span>
  <span class="{ $textClass }">{ $number  ->
    [one] Rating
    *[other] Ratings
  }</span>

comment-counts-seen =
  <span class="{ $numberClass }">{ $count }</span>
  <span class="{ $textClass }">{ $number  ->
    [one] Comment
    *[other] Comments
  }</span>
  &nbsp;
  <span class="{ $dividerClass }">/</span>
  &nbsp;
  <span class="{ $numberClass }">{ $unreadCount }</span>
  <span class="{ $textClass }">Unread</span>

staff-label = Staff
