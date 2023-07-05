### Localization for Embed Stream

## General

general-commentsEmbedSection =
  .aria-label = Yorumları Yerleştir

general-moderate = Yönet
general-archived = Arşivlenmiş

general-userBoxUnauthenticated-joinTheConversation = Sohbete katıl
general-userBoxUnauthenticated-signIn = Giriş yap
general-userBoxUnauthenticated-register = Kayıt ol

general-authenticationSection =
  .aria-label = Kimlik doğrulama

general-userBoxAuthenticated-signedIn = Giriş yapan kullanıcı
general-userBoxAuthenticated-notYou = Siz değil misiniz? <button>Çıkış yapın</button>

general-userBox-youHaveBeenSuccessfullySignedOut = Başarılı bir şekilde hesabınızdan çıkış yaptınız

general-tabBar-commentsTab = Yorumlar
general-tabBar-myProfileTab = Profilim
general-tabBar-discussionsTab = Tartışmalar
general-tabBar-reviewsTab = Değerlendirmeler
general-tabBar-configure = Ayarla

general-mainTablist =
  .aria-label = Ana Sekme

general-secondaryTablist =
  .aria-label = İkinci Sekme

## Comment Count

comment-count-text =
  { $count  ->
    [one] yorum
    *[other] yorum
  }

## Comments Tab

comments-allCommentsTab = Tüm Yorumlar
comments-featuredTab = Öne çıkan
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers =
  { $count  ->
    [one] Bu tartışmayı 1 kişi takip ediyor
    *[other] { SHORT_NUMBER($count) } kişi takip ediyor
  }

comments-announcement-section =
  .aria-label = Duyuru
comments-announcement-closeButton =
  .aria-label = Duyuruyu kapat

comments-accountStatus-section =
  .aria-label = Hesap Durumu

comments-featuredCommentTooltip-how = Bir yorum nasıl öne çıkarılır?
comments-featuredCommentTooltip-handSelectedComments = Değerli olduğu düşünülen yorumlar, ekibimiz tarafından öne çıkarılır.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Öne çıkan yorumlar ipucunu aç/kapat
  .title = Öne çıkan yorumlar ipucunu aç/kapat

comments-collapse-toggle =
  .aria-label = Yorum dizisini daralt
comments-expand-toggle =
  .aria-label = Yorum dizisini genişlet
comments-bannedInfo-bannedFromCommenting = Hesabınızın yorum yapması yasaklandı.
comments-bannedInfo-violatedCommunityGuidelines = Hesabınıza erişimi olan biri topluluk kurallarımızı ihlal etti. Sonuç olarak, hesabınız yasaklandı. Artık yorum yapamayacak, tepkileri kullanamayacak veya yorumları bildiremeyeceksiniz. Bunun yanlışlıkla yapıldığını düşünüyorsanız, lütfen topluluk ekibimizle iletişime geçin.
comments-noCommentsAtAll = Henüz hiç yorum yapılmadı.
comments-noCommentsYet = Henüz hiç yorum yapılmadı. İlk yorum yapan olmak ister misiniz?
comments-streamQuery-storyNotFound = İçerik bulunamadı

comments-communityGuidelines-section =
  .aria-label = Topluluk Rehberi

comments-commentForm-cancel = Vazgeç
comments-commentForm-saveChanges = Değişiklikleri kaydet
comments-commentForm-submit = Gönder

comments-postCommentForm-section =
  .aria-label = Yorum yap
comments-postCommentForm-submit = Gönder
comments-replyList-showAll = Tümünü göster
comments-replyList-showMoreReplies = Daha fazla cevap göster

comments-postComment-gifSearch = GIF ara
comments-postComment-gifSearch-search =
  .aria-label = Ara
comments-postComment-gifSearch-loading = Yükleniyor...
comments-postComment-gifSearch-no-results = {$query} için bir sonuç bulunamadı
comments-postComment-gifSearch-powered-by-giphy =
  .alt = Powered by giphy

comments-postComment-pasteImage = Resim URL’sini yapıştır
comments-postComment-insertImage = Ekle

comments-postComment-confirmMedia-youtube = Bu Youtube videosunu yorumun sonuna eklemek ister misiniz?
comments-postComment-confirmMedia-twitter = Bu Twitter paylaşımını yorumun sonuna eklemek ister misiniz?
comments-postComment-confirmMedia-cancel = Vazgeç
comments-postComment-confirmMedia-add-tweet = Tweet ekle
comments-postComment-confirmMedia-add-video = Video ekle
comments-postComment-confirmMedia-remove = Kaldır
comments-commentForm-gifPreview-remove = Kaldır
comments-viewNew =
  { $count ->
    [1] {$count} yeni yorumu görüntüle
    *[other] {$count} yeni yorumu görüntüle
  }
comments-loadMore = Daha fazla

comments-permalinkPopover =
  .description = Yorumun kalıcı bağlantısını gösteren bir iletişim kutusu
comments-permalinkPopover-permalinkToComment =
  .aria-label = Yorum bağlantısı
comments-permalinkButton-share = Paylaş
comments-permalinkButton =
  .aria-label = {$username} yorumunu paylaş
comments-permalinkView-section =
  .aria-label = Tek sohbet
comments-permalinkView-viewFullDiscussion = Tüm tartışmayı göster
comments-permalinkView-commentRemovedOrDoesNotExist = Bu yorum kaldırıldı veya mevcut değil.

comments-rte-bold =
  .title = Koyu

comments-rte-italic =
  .title = İtalik

comments-rte-blockquote =
  .title = Alıntı

comments-rte-bulletedList =
  .title = Maddeli liste

comments-rte-strikethrough =
  .title = Üstü çizili

comments-rte-spoiler = Spoiler

comments-rte-sarcasm = Alaycı

comments-rte-externalImage =
  .title = Harici resim

comments-remainingCharacters = { $remaining } kalan karakter sayısı

comments-postCommentFormFake-signInAndJoin = Giriş yap ve sohbete katıl

comments-postCommentForm-rteLabel = Yorum yap

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = Cevapla
comments-replyButton =
  .aria-label = {$username} yorumuna cevap ver

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Gönder
comments-replyCommentForm-cancel = Vazgeç
comments-replyCommentForm-rteLabel = Cevap yaz
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-threadLevelLabel = Konu seviyesi { $level }:
comments-commentContainer-highlightedLabel = Öne çıkan:
comments-commentContainer-ancestorLabel = Öncesi:
comments-commentContainer-replyLabel =
  { $username } cevabı <RelativeTime></RelativeTime>
comments-commentContainer-questionLabel =
  { $username } sorusu <RelativeTime></RelativeTime>
comments-commentContainer-commentLabel =
 { $username } yorumu <RelativeTime></RelativeTime>
comments-commentContainer-editButton = Düzenle

comments-commentContainer-avatar =
  .alt = { $username } profil resmi

comments-editCommentForm-saveChanges = Değişiklikleri kaydet
comments-editCommentForm-cancel = Vazgeç
comments-editCommentForm-close = Kapat
comments-editCommentForm-rteLabel = Yorumu düzenle
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Düzenleme için kalan süre: <time></time>
comments-editCommentForm-editTimeExpired = Düzenleme süresi doldu. Artık bu yorumu düzenleyemezsiniz. Neden bir tane daha yayınlamıyorsunuz?
comments-editedMarker-edited = Düzenlendi
comments-showConversationLink-readMore = Bu tartışmadan daha fazlasını oku >
comments-conversationThread-showMoreOfThisConversation = Bu tartışmadan daha fazlasını göster

comments-permalinkView-youAreCurrentlyViewing = Şu anda tek bir tartışmayı görüntülüyorsunuz.
comments-inReplyTo = Cevap verilen kişi <Username></Username>
comments-replyingTo = <Username></Username> kullanıcısına cevap veriyorsunuz

comments-reportButton-report = Bildir
comments-reportButton-reported = Teşekkürler
comments-reportButton-aria-report =
  .aria-label = {$username} yorumunu bildir
comments-reportButton-aria-reported =
  .aria-label = Teşekkürler

comments-sortMenu-sortBy = Sırala
comments-sortMenu-newest = En Yeni
comments-sortMenu-oldest = En Eski
comments-sortMenu-mostReplies = Cevap sayısı

comments-userPopover =
  .description = Daha fazla kullanıcı bilgisi içeren bir açılır pencere
comments-userPopover-memberSince = Üyelik geçmişi: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Yoksay

comments-userIgnorePopover-ignoreUser = {$username} kullanıcıyı göz ardı etmek mi istiyorsunuz?
comments-userIgnorePopover-description = Bir yorumcuyu görmezden geldiğinizde, siteye yazdığı tüm yorumlar sizden gizlenecektir. Bunu daha sonra Profilim'den geri alabilirsiniz.
comments-userIgnorePopover-ignore = Yoksay
comments-userIgnorePopover-cancel = Vazgeç

comments-userBanPopover-title = {$username} kullanıcıyı yasaklamak mı istiyorsunuz?
comments-userBanPopover-description = Bir kez yasaklandığında, bu kullanıcı artık yorum yapamayacak, tepki kullanamayacak veya yorum bildiremeyecek. Bu yorum da reddedilecek.
comments-userBanPopover-cancel = Vazgeç
comments-userBanPopover-ban = Yasakla

comments-moderationDropdown-popover =
  .description = Yorumu denetlemek için açılır bir menü
comments-moderationDropdown-feature = Öne çıkar
comments-moderationDropdown-unfeature = Öne çıkarmayı iptal et
comments-moderationDropdown-approve = Onayla
comments-moderationDropdown-approved = Onaylandı
comments-moderationDropdown-reject = Reddet
comments-moderationDropdown-rejected = Reddedildi
comments-moderationDropdown-ban = Kullanıcıyı yasakla
comments-moderationDropdown-banned = Yasaklandı
comments-moderationDropdown-moderationView = Moderasyon görüntüsü
comments-moderationDropdown-moderateStory = Bu içeriği denetle
comments-moderationDropdown-caretButton =
  .aria-label = Denetle

comments-moderationRejectedTombstone-title = Bu yorumu reddettiniz.
comments-moderationRejectedTombstone-moderateLink = Bu kararı değerlendirmek için Moderasyon sayfasına gidin

comments-featuredTag = Öne çıkan

# $reaction could be "Respect" as an example. Be careful when translating to other languages with different grammar cases.
comments-react =
  .aria-label = {$count ->
    [0] {$reaction} {$username}
    *[other] {$reaction} {$username} (Toplam: {$count})
  }

# $reaction could be "Respected" as an example. Be careful when translating to other languages with different grammar cases.
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} {$username}
    [one] {$reaction} {$username}
    *[other] {$reaction} {$username} (Toplam: {$count})
  }

comments-jumpToComment-title = Cevabınız aşağıda yayınlandı
comments-jumpToComment-GoToReply = Cevaba git

comments-mobileToolbar-closeButton =
  .aria-label = Kapat
comments-mobileToolbar-unmarkAll = Hepsinin işaretini kaldır
comments-mobileToolbar-nextUnread = Sıradaki okunmamış

comments-replyChangedWarning-theCommentHasJust = Bu yorum yeni düzenlendi. En son hali yukarıda görüntülenir.

### Q&A

general-tabBar-qaTab = Soru&Cevap

qa-postCommentForm-section =
  .aria-label = Soru gönder

qa-answeredTab = Cevaplanmış
qa-unansweredTab = Cevaplanmamış
qa-allCommentsTab = Tümü

qa-answered-answerLabel = {$username} cevabı <RelativeTime></RelativeTime>
qa-answered-gotoConversation = Sohbete git
qa-answered-replies = Cevaplar

qa-noQuestionsAtAll = Bu içerikle alakalı soru yok
qa-noQuestionsYet = Henüz hiç soru yok. İlk soruyu sormaya ne dersiniz?
qa-viewNew =
  { $count ->
    [1] {$count} yeni soruyu görüntüle
    *[other] {$count} yeni soruyu görüntüle
  }

qa-postQuestionForm-rteLabel = Soru gönder
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = En çok oy alan

qa-answered-tag = cevaplandı
qa-expert-tag = uzman

qa-reaction-vote = Oy ver
qa-reaction-voted = oy verildi

qa-reaction-aria-vote =
  .aria-label = {$count ->
    [0] Oy {$username}
    *[other] Oy ({$count}) {$username}
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] Oy {$username}
    [one] Oy {$username}
    *[other] ({$count}) {$username}
  }

qa-unansweredTab-doneAnswering = Tamamlandı

qa-expert-email = ({ $email })

qa-answeredTooltip-how = Sorular nasıl cevaplanıyor?
qa-answeredTooltip-answeredComments = Sorular, bir Soru&Cevap uzmanı tarafından yanıtlanır.
qa-answeredTooltip-toggleButton =
  .aria-label = Yanıtlanmış sorular ipucunu aç/kapat
  .title = Yanıtlanmış sorular ipucunu aç/kapat

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title = Hesap silme talebinde bulunuldu
comments-stream-deleteAccount-callOut-receivedDesc = { $date } tarihinde hesabınızın silinmesi için bir talep alındı.
comments-stream-deleteAccount-callOut-cancelDesc = Yorum, yanıt veya tepki bırakmaya devam etmek istiyorsanız hesabınızı silme talebinizi { $date } tarihinden önce iptal edebilirsiniz.
comments-stream-deleteAccount-callOut-cancel = Hesap silme talebini iptal et.
comments-stream-deleteAccount-callOut-cancelAccountDeletion = Hesap silme talebini iptal et.

comments-permalink-copyLink = Linki kopyala
comments-permalink-linkCopied = Link kopyalandı

### Embed Links

comments-embedLinks-showEmbeds = Embedleri göster
comments-embedLinks-hideEmbeds = Embedleri gizle

comments-embedLinks-show-giphy = GIF’I göster
comments-embedLinks-hide-giphy = GIF’I gizle

comments-embedLinks-show-youtube = Videoyu göster
comments-embedLinks-hide-youtube = Videoyu gizle

comments-embedLinks-show-twitter = Tweet’i göster
comments-embedLinks-hide-twitter = Tweet’i gizle

comments-embedLinks-show-external = Resmi göster
comments-embedLinks-hide-external = Resmi gizle


### Featured Comments
comments-featured-label = {$username} kullanıcısının öne çıkarılan yorumu, <RelativeTime></RelativeTime>
comments-featured-gotoConversation = Sohbete git
comments-featured-replies = Cevaplar

## Profile Tab

profile-myCommentsTab = Yorumlarım
profile-myCommentsTab-comments = Yorumlarım
profile-accountTab = Hesap
profile-preferencesTab = Tercihler

### Bio
profile-bio-title = Özgeçmiş
profile-bio-description = Yorum yaptığınız profilinizde herkese açık olarak görüntülenecek maksimum 100 karakterden oluşan bir özgeçmiş yazabilirsiniz.
profile-bio-remove = Kaldır
profile-bio-update = Güncelle
profile-bio-success = Özgeçmişiniz başarıyla güncellendi
profile-bio-removed = Özgeçmişiniz başarıyla silindi.


### Account Deletion

profile-accountDeletion-deletionDesc = Hesabınız { $date } tarihinde silinecek.
profile-accountDeletion-cancelDeletion = Hesap silme talebinizi iptal edin
profile-accountDeletion-cancelAccountDeletion = Hesap silme sürecini iptal edin

### Comment History
profile-commentHistory-section =
  .aria-label = Yorum geçmişi
profile-historyComment-commentLabel = Yorum Tarih: <RelativeTime></RelativeTime> Haber: { $storyTitle }
profile-historyComment-viewConversation = Sohbeti göster
profile-historyComment-replies = {$replyCount} cevap
profile-historyComment-commentHistory = Yorum geçmişi
profile-historyComment-story = Haber: {$title}
profile-historyComment-comment-on = Yorum
profile-profileQuery-errorLoadingProfile = Profil yüklenirken bir sorun oluştu
profile-profileQuery-storyNotFound = İçerik bulunamadı
profile-commentHistory-loadMore = Daha fazla göster
profile-commentHistory-empty = Hiç yorum yazmadınız
profile-commentHistory-empty-subheading = Yorum geçmişiniz burada görüntülenecek

### Preferences

profile-preferences-mediaPreferences = Medya tercihleriniz
profile-preferences-mediaPreferences-alwaysShow = GIF, Tweet, YouTube vb içeriklerini her zaman gösterin
profile-preferences-mediaPreferences-thisMayMake = Bu işlem yorumların görüntülenme sürecini uzatabilir
profile-preferences-mediaPreferences-update = Güncelle
profile-preferences-mediaPreferences-preferencesUpdated = Medya tercihleriniz güncellendi

### Account
profile-account-ignoredCommenters = Yoksayılan yorumcular
profile-account-ignoredCommenters-description = Kullanıcı adlarına tıklayıp Yoksay'ı seçerek diğer yorumcuları Yoksayabilirsiniz. Birini görmezden geldiğinizde, tüm yorumları sizden gizlenir. Yoksaydığınız yorumcular yine de yorumlarınızı görebilir.
profile-account-ignoredCommenters-empty = Yoksaydığınız bir kullanıcı bulunmuyor
profile-account-ignoredCommenters-stopIgnoring = Yorumlarını yeniden gör
profile-account-ignoredCommenters-youAreNoLonger = Yoksayma işlemi iptal edildi
profile-account-ignoredCommenters-manage = Yönet
profile-account-ignoredCommenters-cancel = İptal et
profile-account-ignoredCommenters-close = Kapat

profile-account-changePassword-cancel = İptal et
profile-account-changePassword = Şifreni güncelle
profile-account-changePassword-oldPassword = Eski şifre
profile-account-changePassword-forgotPassword = Şifreni mi unuttun?
profile-account-changePassword-newPassword = Yeni şifre
profile-account-changePassword-button = Şifreni değiştir
profile-account-changePassword-updated = Şifreniz güncellendi
profile-account-changePassword-password = Şifre

profile-account-download-comments-title = Yorum geçmişimi indir
profile-account-download-comments-description = Yorum geçmişinizi indirmek için bir bağlantı içeren bir e-posta alacaksınız. <strong>Her 14 günde bir indirme isteğinde bulunabilirsiniz.</strong>
profile-account-download-comments-request = Yorum geçmişini iste
profile-account-download-comments-request-icon =
  .title = Yorum geçmişini iste
profile-account-download-comments-recentRequest = En son talep tarihiniz: { $timeStamp }
profile-account-download-comments-yourMostRecentRequest = En son talebiniz son 14 gün içindeydi. Yorumlarınızı tekrar indirmeyi { $timeStamp } tarihinden sonra talep edebilirsiniz.
profile-account-download-comments-requested = İstek gönderildi. { framework-timeago-time } içinde başka bir istek gönderebilirsiniz.
profile-account-download-comments-requestSubmitted = Talebiniz başarıyla gönderildi. { framework-timeago-time } içinde yorum geçmişinizi tekrar indirmeyi isteyebilirsiniz.
profile-account-download-comments-error = İndirme isteğinizi tamamlayamadık.
profile-account-download-comments-request-button = Talep et

## Delete Account

profile-account-deleteAccount-title = Hesabımı sil
profile-account-deleteAccount-deleteMyAccount = Hesabımı sil
profile-account-deleteAccount-description = Hesabınızı silmek, profilinizi kalıcı olarak siler ve bu sitedeki tüm yorumlarınızı kaldırır.
profile-account-deleteAccount-requestDelete = Hesap silme talebi

profile-account-deleteAccount-cancelDelete-description = Hesabınızı silmek için zaten bir istek gönderdiniz. Hesabınız { $date } tarihinde silinecek. O zamana kadar talebi iptal edebilirsiniz.
profile-account-deleteAccount-cancelDelete = Hesap silme talebini iptal et

profile-account-deleteAccount-request = Onayla
profile-account-deleteAccount-cancel = İptal et
profile-account-deleteAccount-pages-deleteButton = Hesabımı sil
profile-account-deleteAccount-pages-cancel = İptal et
profile-account-deleteAccount-pages-proceed = İlerle
profile-account-deleteAccount-pages-done = İşlem tamamlandı
profile-account-deleteAccount-pages-phrase =
  .aria-label = İfade

profile-account-deleteAccount-pages-sharedHeader = Hesabımı sil

profile-account-deleteAccount-pages-descriptionHeader = Hesabımı silmek mi istiyorum?
profile-account-deleteAccount-pages-descriptionText = Hesabınızı silmeye çalışıyorsunuz. Bu işlemin sonucunda:
profile-account-deleteAccount-pages-allCommentsRemoved = Sitedeki yorumlarınızın tamamı silinecek.
profile-account-deleteAccount-pages-allCommentsDeleted = Yorumlarınızın tamamı veritabanımızdan silinecek.
profile-account-deleteAccount-pages-emailRemoved = E-posta adresiniz sitemizden silinecek.

profile-account-deleteAccount-pages-whenHeader = Hesabımı sil: Ne zaman?
profile-account-deleteAccount-pages-whenSubHeader = Ne zaman?
profile-account-deleteAccount-pages-whenSec1Header = Hesabım ne zaman silinecek?
profile-account-deleteAccount-pages-whenSec1Content = Hesabınız talebiniz alındıktan 24 saat içerisinde silinecek.
profile-account-deleteAccount-pages-whenSec2Header = Hesabım silinene kadar yorum yapmaya devam edebilir miyim?
profile-account-deleteAccount-pages-whenSec2Content = Hayır. Hesabın silinmesini talep ettiğinizde artık yorum yazamaz, yorumları yanıtlayamaz veya tepki veremezsiniz.
profile-account-deleteAccount-pages-downloadCommentHeader = Yorumlarımı indirebilir miyim?
profile-account-deleteAccount-pages-downloadSubHeader = Yorumlarımı indir.
profile-account-deleteAccount-pages-downloadCommentsDesc = Hesabınız silinmeden önce kayıtlarınız için yorum geçmişinizi indirmenizi öneririz. Hesabınız silindikten sonra yorum geçmişinizi talep edemezsiniz.
profile-account-deleteAccount-pages-downloadCommentsPath = Profilim > Yorum geçmişimi indir

profile-account-deleteAccount-pages-confirmHeader = Hesap silinmesini onaylıyor musun?
profile-account-deleteAccount-pages-confirmSubHeader = Emin misiniz?
profile-account-deleteAccount-pages-confirmDescHeader = Hesabını silmek istediğinden emin misin?
profile-account-deleteAccount-confirmDescContent = Hesabınızı silmek istediğinizi onaylamak için lütfen aşağıdaki metin kutusuna aşağıdaki ifadeyi yazın:
profile-account-deleteAccount-pages-confirmPhraseLabel = Onaylamak için aşağıdaki ifadeyi yazın:
profile-account-deleteAccount-pages-confirmPasswordLabel = Şifrenizi girin

profile-account-deleteAccount-pages-completeHeader = Hesap silme talebi
profile-account-deleteAccount-pages-completeSubHeader = Talebiniz alındı
profile-account-deleteAccount-pages-completeDescript = Talebiniz gönderildi ve hesabınızla ilişkili e-posta adresine bir onay gönderildi.
profile-account-deleteAccount-pages-completeTimeHeader = Hesabınız { $date } tarihinde silinecek
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Fikriniz mi değişti?
profile-account-deleteAccount-pages-completeSignIntoYourAccount = Bu saatten önce hesabınızda tekrar oturum açın ve <strong>Hesap Silme İsteğini İptal Et</strong>'i seçin.

profile-account-deleteAccount-pages-completeTellUsWhy = Bunu neden istiyorsunuz?
profile-account-deleteAccount-pages-completeWhyDeleteAccount = Hesabınızı neden silmeyi seçtiğinizi bilmek istiyoruz. { $email } adresine e-posta göndererek yorum sistemimiz hakkında bize geri bildirim gönderin.
profile-account-changePassword-edit = Düzenle
profile-account-changePassword-change = Değiştir


## Notifications
profile-notificationsTab = Bildirimler
profile-account-notifications-emailNotifications = E-posta Bildirimleri
profile-account-notifications-emailNotifications = = E-posta Bildirimleri
profile-account-notifications-receiveWhen = Hangi durumlarda bildirim almak istersiniz:
profile-account-notifications-onReply = Yorumuma cevap geldiğinde
profile-account-notifications-onFeatured = Yorumum öne çıkarıldığında
profile-account-notifications-onStaffReplies = Site yöneticilerinden birisi cevap verdiğinde
profile-account-notifications-onModeration = Beklemede olan yorumuma işlem yapıldığında
profile-account-notifications-sendNotifications = Ne zaman bildirim almak istersiniz:
profile-account-notifications-sendNotifications-immediately = Hemen
profile-account-notifications-sendNotifications-daily = Günlük
profile-account-notifications-sendNotifications-hourly = Saatlik
profile-account-notifications-updated = Bildirim ayarlarınız kaydedidi
profile-account-notifications-button = Bildirim ayarlarını güncelle
profile-account-notifications-button-update = Güncelle

## Report Comment Popover
comments-reportPopover =
  .description = Yorumları bildirmek için bir iletişim kutusu
comments-reportPopover-reportThisComment = Bu yorumu bildir
comments-reportPopover-whyAreYouReporting = Bu yorumu neden şikayet ediyorsunuz?

comments-reportPopover-reasonOffensive = Bu yorum rahatsız edici
comments-reportPopover-reasonAbusive = Bu yorumcu taciz ediyor
comments-reportPopover-reasonIDisagree = Bu yoruma katılmıyorum
comments-reportPopover-reasonSpam = Reklam içeriği
comments-reportPopover-reasonOther = Diğer

comments-reportPopover-additionalInformation = Ek bilgi <optional>Opsiyonel</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation = Lütfen moderatörlerimize yardımcı olabilecek ek bilgileri bırakın.

comments-reportPopover-maxCharacters = Max. { $maxCharacters } Karakter
comments-reportPopover-restrictToMaxCharacters = Lütfen raporunuz maksimum { $maxCharacters } karakterle sınırlı olsun
comments-reportPopover-cancel = Vazgeç
comments-reportPopover-submit = Gönder

comments-reportPopover-thankYou = Teşekkürler!
comments-reportPopover-receivedMessage = Mesajınızı aldık. Sizin gibi üyelerimizden gelen bildirimler topluluğumuzu güvende tutuyor.
comments-reportPopover-dismiss = Kapat

## Archived Report Comment Popover

comments-archivedReportPopover-reportThisComment = Bu yorumu şikayet et
comments-archivedReportPopover-doesThisComment = Bu yorum topluluk kurallarımızı ihlal mi ediyor? Saldırgan mı yoksa spam mı? <a>{ $orgName }</a> adresindeki moderatör ekibimize bu yorumun bağlantısını ve kısa bir açıklamayı içeren bir e-posta gönderebilirsiniz.
comments-archivedReportPopover-needALink = Bu yorum için link almak mı istiyorsunuz?
comments-archivedReportPopover-copyLink = Linki kopyala

comments-archivedReportPopover-emailSubject = Yorumu bildir
comments-archivedReportPopover-emailBody = Şu yorumu şikayet etmek istiyorum:
  %0A
  { $permalinkURL }
  %0A
  %0A Şikayet nedeni:

## Submit Status
comments-submitStatus-dismiss = Dismiss
comments-submitStatus-submittedAndWillBeReviewed = Yorumunuz gönderildi ve bir moderatör tarafından incelenecek
comments-submitStatus-submittedAndRejected = Bu yorum, topluluk kurallarımızı ihlal ettiği için reddedildi
# Configure
configure-configureQuery-errorLoadingProfile = Yapılandırma yüklenirken hata oluştu
configure-configureQuery-storyNotFound = Haber bulunamadı

## Archive
configure-archived-title = Bu yorum akışı arşivlendi
configure-archived-onArchivedStream = Arşivlenmiş akışlarda yeni yorum, tepki veya rapor gönderilemez. Ayrıca, yorumlar yönetilemez.
configure-archived-toAllowTheseActions = Bu işlemlere izin vermek için yorum akışını arşivden çıkarın.
configure-archived-unarchiveStream = Arşivden çıkar

## Change username
profile-changeUsername-username = Kullanıcı adı
profile-changeUsername-success = Kullanıcı adınız başarıyla güncellendi
profile-changeUsername-edit = Düzenle
profile-changeUsername-change = Değiştir
profile-changeUsername-heading = Kullanıcı adını düzenle
profile-changeUsername-heading-changeYourUsername = Kullanıcı adını değiştir
profile-changeUsername-desc = Tüm geçmiş ve gelecekteki yorumlarınızda görünecek kullanıcı adınızı değiştirin. <strong>Kullanıcı adları her { frame-timeago-time }'de bir değiştirilebilir.</strong>
profile-changeUsername-desc-text = Tüm geçmiş ve gelecekteki yorumlarınızda görünecek kullanıcı adınızı değiştirin. Kullanıcı adları her { framework-timeago-time }'de bir değiştirilebilir.
profile-changeUsername-current = Mevcut kullanıcı adı
profile-changeUsername-newUsername-label = Yeni kullanıcı adı
profile-changeUsername-confirmNewUsername-label = Yeni kullanıcı adını onayla
profile-changeUsername-cancel = Vazgeç
profile-changeUsername-save = Kaydet
profile-changeUsername-saveChanges = Değişiklikleri kaydet
profile-changeUsername-recentChange = Kullanıcı adınız değiştirildi. Kullanıcı adınızı bir daha değiştirmek isterseniz en erken { $nextUpdate } tarihinde güncelleyebilirsiniz.
profile-changeUsername-youChangedYourUsernameWithin = Kullanıcı adınızı son { framework-timeago-time } içinde değiştirdiniz. Kullanıcı adınızı { $nextUpdate } tarihinde tekrar değiştirebilirsiniz.
profile-changeUsername-close = Kapat

## Discussions tab

discussions-mostActiveDiscussions = En aktif tartışmalar
discussions-mostActiveDiscussions-subhead = { $siteName }’de son 24 saat içerisinde en çok yorum alan haberler sıralandı
discussions-mostActiveDiscussions-empty = Hiçbir tartışmaya katılmadınız
discussions-myOngoingDiscussions = Katıldığım tartışmalar
discussions-myOngoingDiscussions-subhead = { $orgName }’de yorum yaptığınız içerikler
discussions-viewFullHistory = Tüm yorum geçmişini göster
discussions-discussionsQuery-errorLoadingProfile = Profil yüklenirken sorun oluştu
discussions-discussionsQuery-storyNotFound = Haber bulunamadı

## Comment Stream
configure-stream-title-configureThisStream = Akışı yapılandır
configure-stream-update = Güncelle
configure-stream-streamHasBeenUpdated = Bu akış güncellendi

configure-premod-premoderateAllComments = Tüm yorumları önceden denetle
configure-premod-description = Moderatörler, bu habere yapılan tüm yorumları yayınlanmadan önce kontrol eder
configure-premodLink-commentsContainingLinks = Bağlantı içeren yorumları önce denetleyin
configure-premodLink-description = Moderatörler, bağlantı içeren herhangi bir yorumu onaylamalıdır.
configure-addMessage-title = Bir mesaj ya da soru ekleyin
configure-addMessage-description = Okuyucularınız için yorum kutusunun üstüne bir mesaj ekleyin. Bunu bir konu oluşturmak, bir soru sormak veya o haberle ilgili duyurular yapmak için kullanın.
configure-addMessage-addMessage = Mesaj ekleyin
configure-addMessage-removed = Mesaj kaldırıldı
config-addMessage-messageHasBeenAdded = Yorum kutusuna mesajınız eklendi
configure-addMessage-remove = Kaldır
configure-addMessage-submitUpdate = Güncelle
configure-addMessage-cancel = Vazgeç
configure-addMessage-submitAdd = Mesajınızı ekleyin

configure-messageBox-preview = Önizleme
configure-messageBox-selectAnIcon = Simge seç
configure-messageBox-iconConversation = Tartışma
configure-messageBox-iconDate = Tarih
configure-messageBox-iconHelp = Yardım
configure-messageBox-iconWarning = Uyarı
configure-messageBox-iconChatBubble = Sohbet balonu
configure-messageBox-noIcon = Simge yok
configure-messageBox-writeAMessage = Mesaj yaz

configure-closeStream-closeCommentStream = Yorum akışını kapat
configure-closeStream-description = Bu yorum akışı şu anda açık. Bu yorum akışını kapattığınızda, yeni yorum gönderilemez ve önceden gönderilen tüm yorumlar görüntülenmeye devam eder.
configure-closeStream-closeStream = Akışı kapat
configure-closeStream-theStreamIsNowOpen = Yorum akışı açık

configure-openStream-title = Akışı aç
configure-openStream-description = Bu yorum akışı şu anda kapalı. Bu yorum akışını açarak yeni yorumlar gönderilebilir ve görüntülenebilir.
configure-openStream-openStream = Akışı aç
configure-openStream-theStreamIsNowClosed = Akış kapalı

configure-moderateThisStream =

qa-experimentalTag-tooltip-content = Soru-&Cevap formatı şu anda etkin geliştirme aşamasındadır. Herhangi bir geri bildirim veya istek için lütfen bizimle iletişime geçin.
configure-enableQA-switchToQA = Soru-&Cevap formatına geçiş yap
configure-enableQA-description = Soru&Cevap formatı, topluluk üyelerinin seçilen uzmanların yanıtlaması için sorular göndermelerine olanak tanır.
configure-enableQA-enableQA = Soru-&Cevap'geçiş yap
configure-enableQA-streamIsNowComments = Bu akış, yorum formatına geçirildi

configure-disableQA-title = Bu soru&cevap’I yapılandır
configure-disableQA-description = Soru&Cevap formatı, topluluk üyelerinin seçilen uzmanların yanıtlaması için sorular göndermelerine olanak tanır.
configure-disableQA-streamIsNowQA = Bu akış artık Soru&Cevap biçiminde

configure-experts-title = Uzman ekle
configure-experts-filter-searchField =
  .placeholder = E-posta ya da kullanıcı adı ile ara
  .aria-label = E-posta ya da kullanıcı adı ile ara
configure-experts-filter-searchButton =
  .aria-label = Ara
configure-experts-filter-description = Yalnızca bu sayfada kayıtlı kullanıcıların yorumlarına bir Uzman Rozeti ekler. Yeni kullanıcılar, hesaplarını oluşturmak için önce kaydolmalı ve bir sayfadaki yorumları açmalıdır.
configure-experts-search-none-found = Bu e-posta veya kullanıcı adıyla hiçbir kullanıcı bulunamadı
configure-experts-remove-button = Kaldır
configure-experts-load-more = Daha fazla göster
configure-experts-none-yet = Bu Soru&Cevap için şu anda bir uzman bulunmuyor.
configure-experts-search-title = Uzman ara
configure-experts-assigned-title = Uzmanlar
configure-experts-noLongerAnExpert = artık uzman değil
comments-tombstone-ignore = Bu yorum, {$username} kullanıcısını yoksaydığınız için boş görünüyor.
comments-tombstone-showComment = Yorumu göster
comments-tombstone-deleted = Yorum yapan kullanıcı hesabını sildi
comments-tombstone-rejected = Bu yorumcu, topluluk kurallarımızı ihlal ettiği için site yönetimi tarafından kaldırıldı.

suspendInfo-heading-yourAccountHasBeen = Hesabınız geçici olarak yorum yapmaktan askıya alındı
suspendInfo-description-inAccordanceWith =
  { $organization }'ın topluluk kurallarına uygun olarak hesabınız geçici olarak askıya alındı. Askıya alınmış durumdayken yorum yapamayacak, tepkileri kullanamayacak veya yorumları bildiremeyeceksiniz.
suspendInfo-until-pleaseRejoinThe = Lütfen sohbete { $until } tarihinde yeniden katılın

warning-heading = Hesabınıza bir uyarı verildi
warning-explanation = Topluluk yönergelerimize göre hesabınıza bir uyarı verilmiştir.
warning-instructions = Tartışmalara katılmaya devam etmek için lütfen aşağıdaki "Kabul ediyorum" düğmesine basın.
warning-acknowledge = Kabul ediyorum
warning-notice = Hesabınıza bir uyarı verildi. Yorumlara katılmaya devam etmek için lütfen <a>uyarı mesajını inceleyin</a>.

modMessage-heading = Hesabınıza bir yönetici tarafından bir mesaj gönderildi
modMessage-acknowledge = Kabul et

profile-changeEmail-unverified = (Doğrulanmadı)
profile-changeEmail-current = (mevcut)
profile-changeEmail-edit = Düzenle
profile-changeEmail-change = Değiştir
profile-changeEmail-please-verify = E-posta adresini doğrula
profile-changeEmail-please-verify-details = Hesabınızı doğrulamak için { $email } adresine bir e-posta gönderildi. Hesabınızda oturum açmak veya bildirim almak için kullanmadan önce yeni e-posta adresinizi doğrulamanız gerekir.
profile-changeEmail-resend = Doğrulamayı yeniden gönder
profile-changeEmail-heading = E-posta adresini düzenle
profile-changeEmail-changeYourEmailAddress = E-posta adresini değiştir
profile-changeEmail-desc = Oturum açmak ve hesabınızla ilgili iletişim kurulması için kullanılan e-posta adresini değiştirin.
profile-changeEmail-newEmail-label = Yeni e-posta adresini girin
profile-changeEmail-password = Şifre
profile-changeEmail-password-input =
  .placeholder = Şifre
profile-changeEmail-cancel = Vazgeç
profile-changeEmail-submit = Kaydet
profile-changeEmail-saveChanges = Değişiklikleri kaydet
profile-changeEmail-email = E-posta
profile-changeEmail-title = E-posta adresi
profile-changeEmail-success = E-posta adresi değiştirildi

## Ratings and Reviews

ratingsAndReviews-postCommentForm-section =
  .aria-label = Bir Değerlendirme Gönderin veya Bir Soru Sorun

ratingsAndReviews-reviewsTab = Değerlendirmeler
ratingsAndReviews-questionsTab = Sorular
ratingsAndReviews-noReviewsAtAll = Değerlendirme yok
ratingsAndReviews-noQuestionsAtAll = Soru yok
ratingsAndReviews-noReviewsYet = Şu anda hiç bir değerlendirme bulunmuyor. İlk değerlendirmeyi yapmaya ne dersiniz?
ratingsAndReviews-noQuestionsYet = Şu anda hiç soru bulunmuyor. İlk soruyu sormaya ne dersiniz?
ratingsAndReviews-selectARating = Oy verin
ratingsAndReviews-youRatedThis = Bunu değerlendirdiniz
ratingsAndReviews-showReview = Değerlendirmeyi gösterin
  .title = { ratingsAndReviews-showReview }
ratingsAndReviews-rateAndReview = Oyla ve Değerlendir
ratingsAndReviews-askAQuestion = Soru sorun
ratingsAndReviews-basedOnRatings = { $count ->
  [0] Hiç oy yok
  [1] Based on 1 rating
  *[other] Based on { SHORT_NUMBER($count) } ratings
}

ratingsAndReviews-allReviewsFilter = Tüm değerlendirmeler
ratingsAndReviews-starReviewsFilter = { $rating ->
  [1] 1 Yıldız
  *[other] { $rating } Yıldız
}

comments-addAReviewForm-rteLabel = Değerlendirme yapın (opsiyonel)

comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

stream-footer-links-top-of-article = Haberin üstü
  .title = En yukarı gidin
stream-footer-links-top-of-comments = Yorumların üstü
  .title = İlk yoruma gidin
stream-footer-links-profile = Profil & Cevaplar
  .title = Profil ve cevaplara gidin
stream-footer-links-discussions = Daha fazla tartışma
  .title = Daha fazla tartışma görün
stream-footer-navigation =
  .aria-label = Yorumların sonu
