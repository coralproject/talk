### Lokasi untuk Embed Stream

## Umum

general-commentsEmbedSection =
  .aria-label = Embed komentar

general-moderate = Sedang
general-archived = Diarsipkan

general-userBoxUnauthenticated-joinTheConversation = Bergabung dalam percakapan
general-userBoxUnauthenticated-signIn = Masuk
general-userBoxUnauthenticated-register = Daftar

general-authenticationSection =
  .aria-label = Autentifikasi

general-userBoxAuthenticated-signedIn =
  Masuk sebagai
general-userBoxAuthenticated-notYou =
  Bukan Anda? <button>Sign Out</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  Anda telah berhasil keluar

general-tabBar-commentsTab = Komentar
general-tabBar-myProfileTab = Profil saya
general-tabBar-discussionsTab = Diskusi
general-tabBar-reviewsTab = Ulasan
general-tabBar-configure = Pengaturan

general-mainTablist =
  .aria-label = Halaman utama

general-secondaryTablist =
  .aria-label = Halaman kedua

## Jumlah komentas

comment-count-text =
  { $count  ->
    [one] Komentar
    *[other] Komentar
  }

## Halaman Komentar

comments-allCommentsTab = Semua komentar
comments-featuredTab = Unggulan
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers =
  { $count  ->
    [one] 1 orang melihat diskusi ini
    *[other] { SHORT_NUMBER($count) } orang yang melihat diskusi ini
  }

comments-announcement-section =
  .aria-label = Pengumuman
comments-announcement-closeButton =
  .aria-label = Tutup Pengumuman

comments-accountStatus-section =
  .aria-label = Status Akun

comments-featuredCommentTooltip-how = Bagaimana fitur komentar?
comments-featuredCommentTooltip-handSelectedComments =
  Komentar dipilih oleh tim kami yang layak dibaca.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Alihkan keterangan komentar unggulan
  .title = Alihkan keterangan komentar unggulan

comments-collapse-toggle =
  .aria-label = Ciutkan utas komentar
comments-expand-toggle =
  .aria-label = Perluas utas komentar
comments-bannedInfo-bannedFromCommenting = Akun Anda telah dilarang untuk berkomentar.
comments-bannedInfo-violatedCommunityGuidelines =
  Seseorang yang memiliki akses ke akun Anda telah melanggar pedoman komunitas kami.
  Akibatnya, akun Anda telah diblokir. Anda tidak akan
  lagi dapat berkomentar, menggunakan reaksi atau melaporkan komentar. Jika Anda
  berfikir ini telah dilakukan karena kesalahan, silakan hubungi tim komunitas kami.

comments-noCommentsAtAll = Tidak ada komentar dalam cerita ini.
comments-noCommentsYet = Belum ada komentar. Mengapa Anda tidak menulis sesuatu?

comments-streamQuery-storyNotFound = Cerita tidak ditemukan

comments-communityGuidelines-section =
  .aria-label = Panduan Komunitas

comments-commentForm-cancel = Batal
comments-commentForm-saveChanges = Simpan perubahan
comments-commentForm-submit = Kirim

comments-postCommentForm-section =
  .aria-label = Tulis komentar
comments-postCommentForm-submit = Kirim
comments-replyList-showAll = Tampilkan semua
comments-replyList-showMoreReplies = Tampilkan semua balasan

comments-postComment-gifSearch = Cari GIF
comments-postComment-gifSearch-search =
  .aria-label = Cari
comments-postComment-gifSearch-loading = Memuat...
comments-postComment-gifSearch-no-results = Tidak ada hasil yang ditemukan{$query}
comments-postComment-gifSearch-powered-by-giphy =
  .alt = Didukung oleh giphy

comments-postComment-pasteImage = Tempel URL gambar
comments-postComment-insertImage = Masukkan

comments-postComment-confirmMedia-youtube = Tambahkan video YouTube ini di akhir komentar Anda?
comments-postComment-confirmMedia-twitter = Tambahkan Tweet ini ke akhir komentar Anda?
comments-postComment-confirmMedia-cancel = Batal
comments-postComment-confirmMedia-add-tweet = Tambahkan Tweet
comments-postComment-confirmMedia-add-video = Tambahkan video
comments-postComment-confirmMedia-remove = Hapus
comments-commentForm-gifPreview-remove = Hapus
comments-viewNew =
  { $count ->
    [1] Lihat {$count} Komentar Baru
    *[other] Lihat {$count} Komentar Baru
  }
comments-loadMore = Memuat lebih banyak

comments-permalinkPopover =
  .description = Dialog yang menunjukkan tautan permanen ke komentar
comments-permalinkPopover-permalinkToComment =
  .aria-label = Tautan permanen ke komentar
comments-permalinkButton-share = Share
comments-permalinkButton =
  .aria-label = Komentar dibagikan oleh {$username}
comments-permalinkView-section =
  .aria-label = Percakapan Tunggal
comments-permalinkView-viewFullDiscussion = Perlihatkan semua diskusi
comments-permalinkView-commentRemovedOrDoesNotExist = Komentar ini telah dihapus atau tidak ada.

comments-rte-bold =
  .title = Tebal

comments-rte-italic =
  .title = Miring

comments-rte-blockquote =
  .title = Blockquote

comments-rte-bulletedList =
  .title = Daftar berpoin

comments-rte-strikethrough =
  .title = Dicoret

comments-rte-spoiler = Bocoran

comments-rte-sarcasm = Sarkasme

comments-rte-externalImage =
  .title = Gambar Eksternal

comments-remainingCharacters = { $remaining } Karakter tersisa

comments-postCommentFormFake-signInAndJoin = Masuk dan Bergabung dalam Percakapan

comments-postCommentForm-rteLabel = Tuliskan Komentar

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = Balas
comments-replyButton =
  .aria-label = Komentar dibalas oleh {$username}

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Kirim
comments-replyCommentForm-cancel = Batal
comments-replyCommentForm-rteLabel = Tuliskan balasan
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-threadLevelLabel = Level utas { $level }:
comments-commentContainer-highlightedLabel = Disorot:
comments-commentContainer-ancestorLabel = Terdahulu:
comments-commentContainer-replyLabel =
  Balasan dari { $username } <RelativeTime></RelativeTime>
comments-commentContainer-questionLabel =
  Pertanyaan dari { $username } <RelativeTime></RelativeTime>
comments-commentContainer-commentLabel =
  Komentar dari { $username } <RelativeTime></RelativeTime>
comments-commentContainer-editButton = Sunting

comments-commentContainer-avatar =
  .alt = Avatar untuk { $username }

comments-editCommentForm-saveChanges = Simpan perubahan
comments-editCommentForm-cancel = Batal
comments-editCommentForm-close = Tutup
comments-editCommentForm-rteLabel = Sunting komentar
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Sunting: <time></time> tersisa
comments-editCommentForm-editTimeExpired = Waktu persuntingan telah kadaluwarsa. Anda tidak dapat lagi menyunting komentar ini. Mengapa tidak memposting yang lain?
comments-editedMarker-edited = Sunting
comments-showConversationLink-readMore = Baca Selengkapnya dari Percakapan ini >
comments-conversationThread-showMoreOfThisConversation =
  Tampilkan Lebih Banyak dari Percakapan Ini

comments-permalinkView-youAreCurrentlyViewing =
  Anda sedang melihat satu percakapan
comments-inReplyTo = Sebagai balasan untuk <Username></Username>
comments-replyingTo = Membalas <Username></Username>

comments-reportButton-report = Laporkan
comments-reportButton-reported = Dilaporkan
comments-reportButton-aria-report =
  .aria-label = Komentar dilaporkan oleh {$username}
comments-reportButton-aria-reported =
  .aria-label = Dilaporkan

comments-sortMenu-sortBy = Sortir
comments-sortMenu-newest = Terbaru
comments-sortMenu-oldest = Terlama
comments-sortMenu-mostReplies = Balasan terbanyak

comments-userPopover =
  .description = Popover dengan lebih banyak informasi pengguna
comments-userPopover-memberSince = Anggota sejak: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Abaikan

comments-userIgnorePopover-ignoreUser = Abaikan {$username}?
comments-userIgnorePopover-description =
  Ketika Anda mengabaikan seorang komentator, semua komentar yang mereka
  tulis di situs akan disembunyikan dari Anda. Kamu bisa
  membatalkan ini melalui Profil Saya.
comments-userIgnorePopover-ignore = Abaikan
comments-userIgnorePopover-cancel = Batal

comments-userBanPopover-title = Dilarang {$username}?
comments-userBanPopover-description =
  Setelah dilarang, pengguna ini tidak akan bisa lagi
  untuk berkomentar, menggunakan reaksi, atau melaporkan komentar.
  Komentar ini juga akan ditolak.
comments-userBanPopover-cancel = Batal
comments-userBanPopover-ban = Dilarang

comments-moderationDropdown-popover =
  .description = Menu popover untuk memoderasi komentar
comments-moderationDropdown-feature = Unggulan
comments-moderationDropdown-unfeature = Non-unggulan
comments-moderationDropdown-approve = Menyetujui
comments-moderationDropdown-approved = Disetujui
comments-moderationDropdown-reject = Menolak
comments-moderationDropdown-rejected = Ditolak
comments-moderationDropdown-ban = Larang Pengguna
comments-moderationDropdown-banned = Dilarang
comments-moderationDropdown-moderationView = Tampilan moderasi
comments-moderationDropdown-moderateStory = Cerita singkat
comments-moderationDropdown-caretButton =
  .aria-label = Sedang

comments-moderationRejectedTombstone-title = Anda telah menolak komentar ini.
comments-moderationRejectedTombstone-moderateLink =
  Moderasi untuk meninjau keputusan ini

comments-featuredTag = Unggulan

# $reaction could be "Respect" as an example. Be careful when translating to other languages with different grammar cases.
comments-react =
  .aria-label = {$count ->
    [0] {$reaction} komentar oleh {$username}
    *[other] {$reaction} komentar oleh{$username} (Total: {$count})
  }

# $reaction could be "Respected" as an example. Be careful when translating to other languages with different grammar cases.
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} komentar oleh {$username}
    [one] {$reaction} komentar oleh {$username}
    *[other] {$reaction} komentar oleh {$username} (Total: {$count})
  }

comments-jumpToComment-title = Balasan Anda telah diposting di bawah ini
comments-jumpToComment-GoToReply = Masukan balasan

comments-mobileToolbar-closeButton =
  .aria-label = Tutup
comments-mobileToolbar-unmarkAll = Hapus semua tanda
comments-mobileToolbar-nextUnread = Berikutnya belum dibaca

comments-replyChangedWarning-theCommentHasJust =
  Komentar ini baru saja disunting. Versi terbaru ditampilkan di atas.

### Q&A

general-tabBar-qaTab = Q&A

qa-postCommentForm-section =
  .aria-label = Ajukan sebuah pertanyaan

qa-answeredTab = Jawab
qa-unansweredTab = Tidak dijawab
qa-allCommentsTab = Semua

qa-answered-answerLabel =
  Jawaban dari {$username} <RelativeTime></RelativeTime>
qa-answered-gotoConversation = Ke Percakapan
qa-answered-replies = Balas

qa-noQuestionsAtAll =
  Tidak ada pertanyaan dalam cerita ini.
qa-noQuestionsYet =
  Belum ada pertanyaan. Mengapa Anda tidak bertanya?
qa-viewNew =
  { $count ->
    [1] View {$count} Pertanyaan Baru
    *[other] View {$count} Pertanyaan Baru
  }

qa-postQuestionForm-rteLabel = Ajukan sebuah pertanyaan
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = Suara terbanyak

qa-answered-tag = jawab
qa-expert-tag = ahli

qa-reaction-vote = Nilai
qa-reaction-voted = Dinilai

qa-reaction-aria-vote =
  .aria-label = {$count ->
    [0] Menilai untuk komentar oleh {$username}
    *[other] Menilai ({$count}) untuk komentar oleh {$username}
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] Dinilai untuk komentar oleh {$username}
    [one] Dinilai untuk komentar oleh {$username}
    *[other] Dinilai ({$count}) untuk komentar oleh {$username}
  }

qa-unansweredTab-doneAnswering = Selesai

qa-expert-email = ({ $email })

qa-answeredTooltip-how = Bagaimana jawaban untuk sebuah pertanyaan?
qa-answeredTooltip-answeredComments =
  Pertanyaan dijawab oleh ahli Q&A.
qa-answeredTooltip-toggleButton =
  .aria-label = Alihkan keterangan alat pertanyaan yang dijawab
  .title = Alihkan keterangan alat pertanyaan yang dijawab

### Cara Penghapusan Akun

comments-stream-deleteAccount-callOut-title =
  Permintaan penghapusan akun
comments-stream-deleteAccount-callOut-receivedDesc =
  Permintaan untuk menghapus akun telah diterima pada { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  Jika Anda ingin terus meninggalkan komentar, balasan atau reaksi,
  Anda dapat membatalkan permintaan untuk menghapus akun Anda sebelum { $date }.
comments-stream-deleteAccount-callOut-cancel =
  Batalkan permintaan penghapusan akun
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  Batakan penghapusan akun

comments-permalink-copyLink = Salin Tautan
comments-permalink-linkCopied = Tautan disalin

### Sematkan Tautan

comments-embedLinks-showEmbeds = Tampilkan sematan
comments-embedLinks-hideEmbeds = Sembunyikan Sematan

comments-embedLinks-show-giphy = Tampilkan GIF
comments-embedLinks-hide-giphy = Sembunyikan GIF

comments-embedLinks-show-youtube = Tampilkan video
comments-embedLinks-hide-youtube = Sebunyikan video

comments-embedLinks-show-twitter = Tampilkan Tweet
comments-embedLinks-hide-twitter = Sembunyikan Tweet

comments-embedLinks-show-external = Tampilkan gambar
comments-embedLinks-hide-external = Sembunyikan gambar


### Komentar unggulan
comments-featured-label =
  Komentar unggulan dari {$username} <RelativeTime></RelativeTime>
comments-featured-gotoConversation = Ke Percakapan
comments-featured-replies = Balasan

## Tab Profil

profile-myCommentsTab = Komentar saya
profile-myCommentsTab-comments = Komentar saya
profile-accountTab = Akun
profile-preferencesTab = Pilihan

### Bio
profile-bio-title = Bio
profile-bio-description =
  Tulis bio untuk ditampilkan secara publik di profil komentar Anda. Harus
  kurang dari 100 karakter.
profile-bio-remove = Hapus
profile-bio-update = Perbarui
profile-bio-success = Bio Anda telah berhasil diperbarui.
profile-bio-removed = Bio Anda telah dihapus.


### Penghapusan Akun

profile-accountDeletion-deletionDesc =
  Akun Anda dijadwalkan akan dihapus pada { $date }.
profile-accountDeletion-cancelDeletion =
  Batalkan permintaan penghapusan akun
profile-accountDeletion-cancelAccountDeletion =
  Batalkan penghapusan akun

### Riwayat Komentar
profile-commentHistory-section =
### Comment History

profile-commentHistory-section =
  .aria-label = Riwayat Komentar

profile-historyComment-commentLabel =
  Komentar<RelativeTime></RelativeTime> on { $storyTitle }

profile-historyComment-viewConversation = Lihat Perbincangan

profile-historyComment-replies = Balasan {$replyCount}

profile-historyComment-commentHistory = Riwayat Komentar

profile-historyComment-story = Cerita: {$title}

profile-historyComment-comment-on = Komentar di:

profile-profileQuery-errorLoadingProfile = Loading profil eror

profile-profileQuery-storyNotFound = Cerita tidak ditemukan

profile-commentHistory-loadMore = Lebih Banyak

profile-commentHistory-empty = Anda belum menulis komentar

profile-commentHistory-empty-subheading = Riwayat komentar Anda akan muncul di sini



### Preferences


profile-preferences-mediaPreferences = Preferensi Media

profile-preferences-mediaPreferences-alwaysShow = Selalu tampilkan GIFs, Tweets, YouTube, dll.

profile-preferences-mediaPreferences-thisMayMake = Ini akan membuat komentar lebih lambat muncul

profile-preferences-mediaPreferences-update = Update

profile-preferences-mediaPreferences-preferencesUpdated =
  Preferensi media Anda sudah diperbarui



### Account

profile-account-ignoredCommenters = Komentar yang diabaikan

profile-account-ignoredCommenters-description =
  Anda dapat mengabaikan komentar dari pengguna lain dengan mengklik username mereka dan memilih Abaikan. Saat Anda mengabaikan seseorang, seluruh komentar mereka akan disembunyikan. Sementara komentar Anda masih bisa dilihat oleh mereka yang Anda abaikan.

profile-account-ignoredCommenters-empty = Anda tidak mengabaikan siapapun

profile-account-ignoredCommenters-stopIgnoring = Berhenti mengabaikan

profile-account-ignoredCommenters-youAreNoLonger =
  Anda tidak lagi mengabaikan komentar

profile-account-ignoredCommenters-manage = Atur

profile-account-ignoredCommenters-cancel = Batal

profile-account-ignoredCommenters-close = Tutup



profile-account-changePassword-cancel = Batal

profile-account-changePassword = Ubah Password

profile-account-changePassword-oldPassword = Password Lama

profile-account-changePassword-forgotPassword = Lupa password Anda?

profile-account-changePassword-newPassword = Password Baru

profile-account-changePassword-button = Ubah Password

profile-account-changePassword-updated =
  Password Anda sudah diperbarui

profile-account-changePassword-password = Password



profile-account-download-comments-title = Unduh riwayat komentar saya

profile-account-download-comments-description =
  Anda akan menerima email dengan link untuk mengunduh riwayat komentar Anda

  You can make <strong>one download request every 14 days.</strong>

profile-account-download-comments-request =
  Permintaan riwayat komentar

profile-account-download-comments-request-icon =
  .title = Permintaan riwayat komentar

profile-account-download-comments-recentRequest =
  Permintaan terbaru Anda: { $timeStamp }

profile-account-download-comments-yourMostRecentRequest =
  Permintaan terbaru Anda dalam 14 hari terakhir. Anda boleh melakukan permintaan mengunduh komentar lagi di: { $timeStamp }

profile-account-download-comments-requested =
  Permintaan diterima. Anda bisa mengirim permintaan lain pada { framework-timeago-time }.

profile-account-download-comments-requestSubmitted =
  Permintaan Anda telah diterima. Anda bisa mengirim permintaan untuk mengunduh riwayat komentar lagi pada { framework-timeago-time }.

profile-account-download-comments-error =
  Kami tidak dapat menyelesaikan permintaan unduhan Anda.

profile-account-download-comments-request-button = Permintaan



## Delete Account



profile-account-deleteAccount-title = Hapus Akun Saya

profile-account-deleteAccount-deleteMyAccount = Hapus Akun Saya

profile-account-deleteAccount-description =
  Menghapus akun Anda akan secara permanen menghapus profil dan komentar Anda dari situs ini.

profile-account-deleteAccount-requestDelete = Permintaan penghapusan akun



profile-account-deleteAccount-cancelDelete-description =
  Anda telah mengirim permintaan penghapusan akun Anda.

  Akun Anda akan dihapus pada { $date }.

  Anda diperbolehkan membatalkan permintaan penghapusan akun hingga waktu tersebut.

profile-account-deleteAccount-cancelDelete = Batalkan permintaan penghapusan akun



profile-account-deleteAccount-request = Permintaan

profile-account-deleteAccount-cancel = Batal

profile-account-deleteAccount-pages-deleteButton = Hapus akun saya

profile-account-deleteAccount-pages-cancel = Batal

profile-account-deleteAccount-pages-proceed = Lanjutkan

profile-account-deleteAccount-pages-done = Selesai

profile-account-deleteAccount-pages-phrase =
  .aria-label = Frasa



profile-account-deleteAccount-pages-sharedHeader = Hapus akun saya



profile-account-deleteAccount-pages-descriptionHeader = Hapus akun saya?

profile-account-deleteAccount-pages-descriptionText =
  Anda mencoba untuk menghapus akun Anda. Ini berarti:

profile-account-deleteAccount-pages-allCommentsRemoved =
  Semua komentar Anda akan dihapus dari situs ini

profile-account-deleteAccount-pages-allCommentsDeleted =
  Semua komentar Anda akan dihapus dari database kami

profile-account-deleteAccount-pages-emailRemoved =
  Email Anda akan dihapus dari sistem kami



profile-account-deleteAccount-pages-whenHeader = Hapus akun saya: Kapan?

profile-account-deleteAccount-pages-whenSubHeader = Kapan?

profile-account-deleteAccount-pages-whenSec1Header =
  Kapan akun saya akan dihapus?

profile-account-deleteAccount-pages-whenSec1Content =
  Akun Anda akan dihapus 24 jam setelah permintaan penghapusan akun dilakukan.

profile-account-deleteAccount-pages-whenSec2Header =
  Apakah saya masih bisa membuat komentar sampai akun saya dihapus?

profile-account-deleteAccount-pages-whenSec2Content =
  Tidak. Setelah Anda meminta akun dihapus, Anda tidak bisa lagi mengirim, membalas komentar atau memilih reaksi.



profile-account-deleteAccount-pages-downloadCommentHeader = Unduh komentar saya?

profile-account-deleteAccount-pages-downloadSubHeader = Unduh komentar saya

profile-account-deleteAccount-pages-downloadCommentsDesc =
  Sebelum akun Anda dihapus, kami sarankan Anda mengunduh riawayat komentar Anda. Setelah akun Anda dihapus, Anda tidak bisa mengajukan pengunduhan riwayat komentar.

profile-account-deleteAccount-pages-downloadCommentsPath =
  Profil Saya > Unduh Riwayat Komentar Saya



profile-account-deleteAccount-pages-confirmHeader = Konfirmasi penghapusan akun?

profile-account-deleteAccount-pages-confirmSubHeader = Anda yakin?

profile-account-deleteAccount-pages-confirmDescHeader =
  Are you sure you want to delete your account?

profile-account-deleteAccount-confirmDescContent =
  Untuk mengonfirmasi penghapusan Akun tolong ketik frasa ini di text box:

profile-account-deleteAccount-pages-confirmPhraseLabel =
  Untuk konfirmasi, ketik frasa di bawah ini:

profile-account-deleteAccount-pages-confirmPasswordLabel =
  Masukan password Anda:



profile-account-deleteAccount-pages-completeHeader = Penghapusan akun telah diminta

profile-account-deleteAccount-pages-completeSubHeader = Permintaan telah diterima

profile-account-deleteAccount-pages-completeDescript =
  Permintaan Anda telah diterima dan tautan konfirmasi telah dikirim ke email yang disambungkan ke akun Anda.

profile-account-deleteAccount-pages-completeTimeHeader =
  Akun Anda akan dihapus pada: { $tanggal}

profile-account-deleteAccount-pages-completeChangeYourMindHeader = Anda berubah pikiran?

profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  Langsung masuk ke akun Anda lagi sebelum tanggal yang ditentukan dan pilih

  <strong>Batalkan permintaan penghapusan akun</strong>.

profile-account-deleteAccount-pages-completeTellUsWhy = Beritahu kami kenapa.

profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  Kami ingin tahu mengapa Anda memilih untuk menghapus akun Anda. Kirimkan feedback Anda mengenai sistem komentar kami dengan mengirim email { $email }.

profile-account-changePassword-edit = Edit

profile-account-changePassword-change = Ubah





## Notifications

profile-notificationsTab = Notifikasi

profile-account-notifications-emailNotifications = Notifikasi E-Mail

profile-account-notifications-emailNotifications = Notifikasi Email

profile-account-notifications-receiveWhen = Terima notifikasi kapan:

profile-account-notifications-onReply = Komentar saya mendapatkan balasan

profile-account-notifications-onFeatured = Komentar saya ditampilkan

profile-account-notifications-onStaffReplies = Staf membalas komentar saya

profile-account-notifications-onModeration = Komentar saya yang pending telah direview

profile-account-notifications-sendNotifications = Kirim Notifikasi:

profile-account-notifications-sendNotifications-immediately = Segera

profile-account-notifications-sendNotifications-daily = Harian

profile-account-notifications-sendNotifications-hourly = Per jam

profile-account-notifications-updated = Setelan notifikasi Anda telah diperbarui

profile-account-notifications-button = Perbarui Setelan Notifikasi

profile-account-notifications-button-update = Perbarui



## Report Comment Popover

comments-reportPopover =
  .description = Dialog untuk melaporkan komentar

comments-reportPopover-reportThisComment = Laporkan Komentar Ini

comments-reportPopover-whyAreYouReporting = Mengapa Anda melaporkan komentar ini?



comments-reportPopover-reasonOffensive = Komentar ini ofensif

comments-reportPopover-reasonAbusive = Komentator kasar

comments-reportPopover-reasonIDisagree = Saya tidak setuju dengan komentar ini

comments-reportPopover-reasonSpam = Ini terlihat seperti iklan atau marketing

comments-reportPopover-reasonOther = Lainnya



comments-reportPopover-additionalInformation =
  Informasi tambahan <optional>Lainnya</optional>

comments-reportPopover-pleaseLeaveAdditionalInformation =
  Tolong tinggalkan informasi lebih yang mungkin berguna untuk moderator kami.



comments-reportPopover-maxCharacters = Max. { $maxCharacters } Karakter

comments-reportPopover-restrictToMaxCharacters = Harap batasi laporan Anda mengenai { $maxCharacters } karakter

comments-reportPopover-cancel = Batal

comments-reportPopover-submit = Kirimkan



comments-reportPopover-thankYou = Terima kasih!

comments-reportPopover-receivedMessage =
  Kami telah menerima pesan Anda. Laporan dari anggota seperti Anda membantu kami menjaga komunitas ini.



comments-reportPopover-dismiss = Dismiss



## Archived Report Comment Popover



comments-archivedReportPopover-reportThisComment = Laporkan Komentar Ini

comments-archivedReportPopover-doesThisComment =
  Apakah komentar ini melanggar pedoman komunitas kami? Komentar ini kasar atau spam?

  Kirimkan email ke tim moderasi kami di <a>{ $orgName }</a> beserta link komentar ini dan penjelasan jelasnya.

comments-archivedReportPopover-needALink =
  Butuh tautan untuk komentar ini?

comments-archivedReportPopover-copyLink = Salin tautan



comments-archivedReportPopover-emailSubject = Laporkan komentar

comments-archivedReportPopover-emailBody =
  Saya ingin melaporkan komentar berikut:

  %0A

  { $permalinkURL }

  %0A

  %0A

  Untuk alasan di bawah ini:



## Submit Status

comments-submitStatus-dismiss = Tutup

comments-submitStatus-submittedAndWillBeReviewed =
  Komentar Anda telah kami terima dan akan direview oleh moderator

comments-submitStatus-submittedAndRejected =
  Komentar ini telah ditolak karena melanggar pedoman kami



# Configure

configure-configureQuery-errorLoadingProfile = Loading setelan bermasalah

configure-configureQuery-storyNotFound = Cerita tak ditemukan



## Archive

configure-archived-title = Aliran komentar ini telah diarsipkan

configure-archived-onArchivedStream =
  Pada arsip aliran komentar, tidak ada komentar baru, reaksi atau laporan

  Yang dikirimkan. Komentar juga tidak bisa dimoderasi.

configure-archived-toAllowTheseActions =
  Untuk memperbolehkan aksi ini, aliran tidak boleh diarsipkan.

configure-archived-unarchiveStream = Jangan arsipkan aliran



## Change username

profile-changeUsername-username = Username

profile-changeUsername-success = Username Anda berhasil diperbarui

profile-changeUsername-edit = Edit

profile-changeUsername-change = Ubah

profile-changeUsername-heading = Edit username Anda

profile-changeUsername-heading-changeYourUsername = Ubah username Anda

profile-changeUsername-desc = Ubah username yang akan tampil di komentar baru dan lama Anda. <strong>Username hanya bisa diubah sekali dalam { framework-timeago-time }.</strong>

profile-changeUsername-desc-text = Ubah username yang akan tampil di komentar baru dan lama Anda. Username hanya bisa diubah sekali dalam { framework-timeago-time }.

profile-changeUsername-current = Username saat ini

profile-changeUsername-newUsername-label = Username baru

profile-changeUsername-confirmNewUsername-label = Konfirmasi username baru

profile-changeUsername-cancel = Batal

profile-changeUsername-save = Simpan

profile-changeUsername-saveChanges = Simpan perubahan

profile-changeUsername-recentChange = Username Anda sudah pernah diubah. Anda baru bisa mengubah username lagi pada { $nextUpdate }.

profile-changeUsername-youChangedYourUsernameWithin =
  Anda telah mengubah username dalam { framework-timeago-time }. Anda baru bisa mengubah username lagi pada: { $nextUpdate }.

profile-changeUsername-close = Tutup



## Discussions tab



discussions-mostActiveDiscussions = Diskusi paling aktif

discussions-mostActiveDiscussions-subhead = Ditentukan berdasarkan komen terbanyak yang diterima dalam 24 jam terakhir di { $siteName }

discussions-mostActiveDiscussions-empty = Anda belum berpartisipasi dalam diskusi apapun

discussions-myOngoingDiscussions = Diskusi saya yang sedang berjalan

discussions-myOngoingDiscussions-subhead = Di mana Anda telah berkomentar { $orgName }

discussions-viewFullHistory = Lihat riwayat komentar selengkapnya

discussions-discussionsQuery-errorLoadingProfile = Loading profil bermasalah

discussions-discussionsQuery-storyNotFound = Cerita tidak ditemukan



## Comment Stream

configure-stream-title-configureThisStream =
  Konfigurasi aliran ini

configure-stream-update = Perbarui

configure-stream-streamHasBeenUpdated =
  Aliran ini sudah diperbarui



configure-premod-premoderateAllComments = Pra-moderasi seluruh komentar

configure-premod-description =
  Moderator harus menyetujui komentar apapun sebelum dipublikasikan di cerita ini.



configure-premodLink-commentsContainingLinks =
  Pra-moderasi komentar yang mengandung tautan

configure-premodLink-description =
  Moderator harus menyetejui komentar apapun yang mengandung tautan sebelum dipublikasikan di cerita ini.



configure-addMessage-title =
  Tambahkan pesan atau pertanyaan

configure-addMessage-description =
  Tambahkan pesan ke bagian paling atas komentar untuk pembaca Anda. Gunakan ini untuk mengunggah topik, menanyakan pertanyaan atau membuat pengumuman terkait cerita ini.

configure-addMessage-addMessage = Tambahkan pesan

configure-addMessage-removed = Pesan telah dihapus

config-addMessage-messageHasBeenAdded =
  Pesan ini telah ditambahkan ke box komentar

configure-addMessage-remove = Hapus

configure-addMessage-submitUpdate = Perbarui

configure-addMessage-cancel = Batal

configure-addMessage-submitAdd = Tambahkan pesan



configure-messageBox-preview = Pratinjau

configure-messageBox-selectAnIcon = Pilih ikon

configure-messageBox-iconConversation = Perbincangan

configure-messageBox-iconDate = Tanggal

configure-messageBox-iconHelp = Bantuan

configure-messageBox-iconWarning = Peringatan

configure-messageBox-iconChatBubble = Gelembung Chat

configure-messageBox-noIcon = Tidak ada ikon

configure-messageBox-writeAMessage = Tulis pesan



configure-closeStream-closeCommentStream =
  Tutup aliran komentar

configure-closeStream-description =
  Aliran komentar ini sedang terbuka. Dengan menutup aliran komentar ini, tidak akan ada komentar baru yang diterima dan seluruh komentar yang telah dikirim akan tetap terlihat.

configure-closeStream-closeStream = Tutup Aliran

configure-closeStream-theStreamIsNowOpen = Aliran sekarang terbuka



configure-openStream-title = Buka Aliran

configure-openStream-description =
  Aliran komentar ini sedang tertutup. Dengan membuka aliran komentar ini, komentar baru akan diterima dan terlihat.

configure-openStream-openStream = Buka Aliran

configure-openStream-theStreamIsNowClosed = Aliran ini sekarang tertutup



qa-experimentalTag-tooltip-content =
  Format Q&A sedang dalam pengembangan aktif. Silahkan hubungi kami jika ada masukan atau permintaan.



configure-enableQA-switchToQA =
  Beralih ke format Q&A

configure-enableQA-description =
  Format Q&A memperbolehkan anggota komunitas untuk mengirim pertanyaan untuk dijawab oleh para ahli.

configure-enableQA-enableQA = Beralih ke Q&A

configure-enableQA-streamIsNowComments =
  Aliran ini sekarang dalam format komentar



configure-disableQA-title = Configure this Q&A

configure-disableQA-description =
  Format Q&A memperbolehkan anggota komunitas untuk mengirim pertanyaan yang akan dijawab oleh para ahli.

configure-disableQA-disableQA = Beralih ke Komentar

configure-disableQA-streamIsNowQA =
  Aliran ini sekarang dalam format Q&A



configure-experts-title = Tambahkan Ahli

configure-experts-filter-searchField =
  .placeholder = Cari melalui email atau username
  .aria-label = Cari melalui email atau username

configure-experts-filter-searchButton =
  .aria-label = Cari

configure-experts-filter-description =
  Tambahkan Expert Badge ke komentar dari pengguna yang terdaftar, hanya di halaman ini. Pengguna baru harus mendaftar terlebih dulu dan membuka komentar untuk membuat akun.

configure-experts-search-none-found = Tidak ada pengguna yang ditemukan melalui email atau username

configure-experts-remove-button = Hapus

configure-experts-load-more = Lebih Banyak

configure-experts-none-yet = Untuk saat ini tidak ada ahli dalam Q&A ini.

configure-experts-search-title = Cari seorang ahli

configure-experts-assigned-title = Ahli

configure-experts-noLongerAnExpert = sudah bukan lagi seorang ahli

comments-tombstone-ignore = Komentar ini disembunyikan karena Anda mengabaikan {$username}

comments-tombstone-showComment = Tampilkan komentar

comments-tombstone-deleted =
  Komentar ini tak lagi tersedia. Komentator telah menghapus akunnya.

comments-tombstone-rejected =
  Komentator ini telah dihapus oleh moderator karena melanggar pedoman komunitas kami.



suspendInfo-heading-yourAccountHasBeen =
  Akun Anda untuk sementara ditangguhkan dan tidak bisa mengirim komentar

suspendInfo-description-inAccordanceWith =
  Sesuai dengan pedoman komunitas { $organization }'s akun Anda untuk sementara ditangguhkan. Pada saat dalam masa penangguhan, Anda tidak bisa memberikan komentar, menggunakan reaksi atau melaporkan komentar.

suspendInfo-until-pleaseRejoinThe =
  Tolong kembali bergabung di perbincangan { $until }



warning-heading = Akun Anda telah diberikan peringatan

warning-explanation =
  Sesuai dengan pedoman komunitas kami akun Anda telah diberikan peringatan.

warning-instructions =
  Untuk terus berpartisipasi dalam diskusi, dimohon menekan tombol “Acknowledge” di bawah ini.

warning-acknowledge = Acknowledge



warning-notice = Akun ada telah diberikan peringatan. Untuk terus berpartisipasi, dimohon untuk <a>meninjau pesan peringatan</a>.



modMessage-heading = Moderator mengirim pesan ke akun Anda

modMessage-acknowledge = Acknowledge



profile-changeEmail-unverified = (Tidak terverivikasi)

profile-changeEmail-current = (saat ini)

profile-changeEmail-edit = Edit

profile-changeEmail-change = Ubah

profile-changeEmail-please-verify = Verifikasi email Anda

profile-changeEmail-please-verify-details =
  Kami telah mengirimkan email ke { $email } untuk verifikasi akun Anda.

  Anda harus melakukan verifikasi email baru Anda sebelum digunakan

  Masuk ke akun Anda atau menerima notifikasi.

profile-changeEmail-resend = Kirim ulang verifikasi

profile-changeEmail-heading = Edit email Anda

profile-changeEmail-changeYourEmailAddress =
  Ubah email Anda

profile-changeEmail-desc = Ubah email yang Anda gunakan untuk masuk dan menerima komunikasi terkait akun Anda.

profile-changeEmail-newEmail-label = Email baru

profile-changeEmail-password = Password

profile-changeEmail-password-input =
  .placeholder = Password

profile-changeEmail-cancel = Batal

profile-changeEmail-submit = Simpan

profile-changeEmail-saveChanges = Simpan Perubahan

profile-changeEmail-email = Email

profile-changeEmail-title = Alamat email

profile-changeEmail-success = Email Anda telah sukses diperbarui



## Ratings and Reviews


ratingsAndReviews-postCommentForm-section =
  .aria-label = Kirim sebuah review atau Tanyakan Sesuatu

ratingsAndReviews-reviewsTab = Review

ratingsAndReviews-questionsTab = Pertanyaan

ratingsAndReviews-noReviewsAtAll = Tidak ada review.

ratingsAndReviews-noQuestionsAtAll = Tidak ada pertanyaan.

ratingsAndReviews-noReviewsYet = Belum ada review. Mengapa Anda tidak menulis satu?

ratingsAndReviews-noQuestionsYet = Belum ada pertanyaan. Mengapa Anda tidak menanyakan sesuatu?

ratingsAndReviews-selectARating = Pilih nilai

ratingsAndReviews-youRatedThis = Anda telah menilai ini

ratingsAndReviews-showReview = Tampilkan review
  .title = { ratingsAndReviews-showReview }

ratingsAndReviews-rateAndReview = Nilai dan Review

ratingsAndReviews-askAQuestion = Tanyakan Sesuatu

ratingsAndReviews-basedOnRatings =
  { $count ->
    [0] No ratings yet
    [1] Based on 1 rating
    *[other] Based on { SHORT_NUMBER($count) } ratings
  }



ratingsAndReviews-allReviewsFilter = Semua reviews

ratingsAndReviews-starReviewsFilter =
  { $rating ->
    [1] 1 Star
    *[other] { $rating } Stars
  }



comments-addAReviewForm-rteLabel = Tambahkan review (opsional)



comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }



comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }



stream-footer-links-top-of-article = Artikel teratas
  .title = Menuju artikel teratas

stream-footer-links-top-of-comments = Komentar teratas
  .title = Menuju komentar teratas

stream-footer-links-profile = Profil & Balasan
  .title = Menuju profil dan balasan

stream-footer-links-discussions = Lebih banyak diskusi
  .title = Menuju lebih banyak diskusi

stream-footer-navigation =
  .aria-label = Komentar Footer

