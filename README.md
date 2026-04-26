# Gayrimenkul İşlem Sistemi

Dinamik komisyon hesaplamaları ve aşama takibi de dahil olmak üzere gayrimenkul işlemlerinin yaşam döngüsünü otomatikleştirmek ve yönetmek için **NestJS** ve **Nuxt 3** ile oluşturulmuş tam yığın (full-stack) bir uygulama.

## Ön Koşullar
- **Node.js**: v18 veya daha yenisi (LTS önerilir)
- **MongoDB Atlas**: Bir MongoDB bağlantı dizeniz (connection string) olmalıdır.
- **npm** veya **yarn**

---

## 1. Arka Uç Kurulumu (NestJS)

1. Bir terminal açın ve `api` klasörüne gidin:
   ```bash
   cd api
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Çevresel Değişkenleri Yapılandırın:
   `api` kök dizininde bir `.env` dosyası oluşturun:
   ```env
   MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/real_estate
   JWT_SECRET=super_secret_key_here
   COMMISSION_RATE=0.03
   ```
   *( `<username>` ve `<password>` kısımlarını gerçek MongoDB Atlas kimlik bilgilerinizle değiştirdiğinizden emin olun).*

4. Seed Komut Dosyasını Çalıştırın (İsteğe Bağlı ama Şiddetle Tavsiye Edilir):
   Ön yüzü test etmek için sahte Ajanslar, Danışmanlar ve İlanlar oluşturmak için:
   ```bash
   npx ts-node src/scripts/seed.ts
   ```

5. Arka Uç Birim Testlerini Çalıştırın:
   ```bash
   npm run test
   ```

6. Arka Uç Sunucusunu Başlatın:
   ```bash
   npm run start:dev
   ```
   *Arka uç http://localhost:3000 adresinde çalışacaktır.*

---

## 2. Ön Yüz Kurulumu (Nuxt 3)

1. Yeni bir terminal açın ve `web` klasörüne gidin:
   ```bash
   cd web
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Çevresel Değişkenleri Yapılandırın:
   `web` kök dizininde bir `.env` dosyası oluşturun:
   ```env
   PORT=4000
   NUXT_PUBLIC_API_BASE=http://localhost:3000
   ```

4. Ön Yüz Sunucusunu Başlatın:
   ```bash
   npm run dev
   ```
   *Ön yüz http://localhost:4000 adresinde çalışacaktır.*

---

## 3. Akış Nasıl Test Edilir
1. Tarayıcınızda `http://localhost:4000` adresine gidin.
2. Seed komut dosyasını çalıştırdıysanız, şu bilgilerle giriş yapın:
   - E-posta: `agency@test.com`
   - Şifre: `password123`
3. Kenar çubuğundan **"İşlemler" (Transactions)** menüsüne tıklayın.
4. **"+ Yeni Satış Başlat" (New Transaction)** butonuna tıklayın.
5. Bir İlan ve bir Satış Danışmanı seçin, ardından Başlat'a basın.
6. Stage Tracker (Aşama Takibi) arayüzünü kullanarak aşamalarda ilerleyin (Anlaşma -> Kaparo -> Tapu -> Tamamlandı).
7. Tamamlandığında otomatik Komisyon Dağılımı kartını inceleyin!

## Dokümantasyon
Mimari, veri modelleri ve iş mantığı kararlarına ilişkin eksiksiz bir genel bakış için lütfen [DESIGN.md](./DESIGN.md) dosyasına bakın.
