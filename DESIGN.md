# Gayrimenkul İşlem Sistemi - Tasarım Belgesi

## 1. Problem Analizi ve Çözüm Özeti
Hedef, güvenli, izlenebilir ve otomatikleştirilmiş bir gayrimenkul işlem yönetim sistemi kurmaktı. Problemin temelinde, bir mülkün "Anlaşma" (Agreement) aşamasından "Tamamlandı" (Completed) aşamasına geçişi ve tamamlanma üzerine finansal dağılımın (komisyon) ajans ve ilgili danışmanlar arasında kesin bir şekilde dağıtılması yer almaktadır.

Çözüm, ölçeklenebilir ve modüler bir arka uç için **NestJS** ve duyarlı, premium bir ön yüz arayüzü için **Nuxt 3** ile **Pinia** + **Tailwind CSS v4** kullanmaktadır.

## 2. Mimari ve Modül Organizasyonu (Arka Uç)
Arka uç, etki alanı odaklı modüllere (domain-driven) göre yapılandırılmıştır:
- `AuthModule`: JWT tabanlı kimlik doğrulamayı ve kullanıcı oturumlarını yönetir.
- `UsersModule`: Kullanıcı kayıtlarını ve rollerini (`AGENCY`, `AGENT`) yönetir.
- `ListingsModule`: Emlak ilanlarını yönetir.
- `TransactionsModule`: Bir satışın yaşam döngüsünü yöneten sistemin ana motorudur.

### Mimari Kararlar:
- **Guard ve Dekoratörler**: `AccessTokenGuard`, gereken yerlerde yetkisiz erişimi küresel olarak engeller.
- **Service Layer (Hizmet Katmanı) Modeli**: Denetleyiciler (Controllers) yalnızca HTTP isteklerini işlerken, iş kuralları (ör. Komisyon hesaplamaları ve Aşama Geçişi kontrolleri) tamamen `TransactionsService` içinde yer alır.

## 3. Veri Modelleme (MongoDB Atlas)
Katı şemalar tanımlamak için Mongoose kullanıldı.
- **User Schema (Kullanıcı Şeması)**: `AGENCY` (Ajans) ve `AGENT` (Danışman) arasında ayrım yapar. Danışmanlar, standart bir MongoDB ObjectId referansı kullanarak bağlı oldukları Ajansa referans verir.
- **Listing Schema (İlan Şeması)**: Mülk detaylarını (başlık, fiyat, konum) ve `listingAgent` (ilan danışmanı) referansını içerir.
- **Transaction Schema (İşlem Şeması)**: Veri modellerinin bağlantı noktasıdır.
  - `Listing`, `listingAgent` ve `sellingAgent`a referans verir.
  - `stage` (aşama) yaşam döngüsünü zorunlu kılar (`agreement` -> `earnest_money` -> `title_deed` -> `completed`).
  - Yalnızca aşama `completed` (tamamlandı) durumuna ulaştığında doldurulan gömülü bir `commission` belgesi içerir. Bu karar, karmaşık ilişkisel sorguları önler ve finansal durumu tamamlanma anında kalıcı olarak yakalar.

## 4. Temel İş Mantığı Uygulaması
Gereksinimlere uygun olarak, işlem mantığı katı geçiş kurallarını sağlar.
- **Aşama Geçişleri**: Sabit kodlanmış bir `STAGE_ORDER` dizisi, kullanıcıların aşamaları atlamamasını veya geriye gitmemesini sağlar (örneğin, `TITLE_DEED` aşamasından `AGREEMENT` aşamasına geçiş `BadRequestException` hatası fırlatır).
- **Finansal Dağılım (Komisyon)**: 
  İşlem `completed` aşamasına ulaştığı anda dinamik olarak hesaplanır. 
  - Ajans her zaman %50 alır (`totalServiceFee * 0.5`).
  - Eğer `listingAgent` === `sellingAgent` ise, kalan %50'yi alırlar.
  - Farklı iseler, kalan %50 eşit olarak bölünür (her birine %25).

## 5. Ön Yüz Mimarisi ve Durum Yönetimi (Nuxt 3)
- **Nuxt 3**: Uygulama, hızlı yönlendirme, düzen (layout) kalıcılığı ve modern Vue 3 composition API yetenekleri sağlamak için Nuxt 3'ten yararlanır.
- **Pinia Stores**: 
  - `auth.ts`: Kullanıcı token'larını `localStorage` içinde güvenli bir şekilde yönetir.
  - `transactions.ts`: Prop-drilling'i önleyen ve API durumlarını merkezi olarak işleyen, aktif işlemlerin durumunu yöneten merkezi bir store.
- **Composable (`useApi`)**: `Authorization` Bearer token'ını eklemek için istekleri otomatik olarak araya giren (intercept) özel bir `$fetch` sarmalayıcısı.
- **UI/UX (Tailwind v4)**: Premium bir "lacivert / açık yüzey" estetiğine kesinlikle uyulmuştur. Yeniden kullanılabilirliği sağlamak için `StageTracker.vue` (görsel adım takibi için) ve `CommissionCard.vue` (finansal dağılım görselleştirmesi için) gibi özel bileşenler sıfırdan oluşturulmuştur.
