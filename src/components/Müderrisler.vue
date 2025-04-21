<template>
  <div class="muderrisler-container">
    <h1 class="page-title">Osmanlı'nın İlim Önderleri</h1>
    
    <div class="muderrisler-grid">
      <!-- Padişahlar -->
      <div v-for="muderris in muderrisler" :key="muderris.id" class="muderris-card">
        <div class="muderris-image">
          <img :src="muderris.image" :alt="muderris.name">
        </div>
        <div class="muderris-content">
          <h3>{{ muderris.name }}</h3>
          <p class="muderris-title">{{ muderris.title }}</p>
          <p class="muderris-period">{{ muderris.period }}</p>
          <p class="muderris-desc">{{ muderris.description }}</p>
          <div class="muderris-works">
            <h4>Başlıca Eserleri:</h4>
            <ul>
              <li v-for="(work, index) in muderris.works" :key="index">
                {{ work }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const muderrisler = [
  {
    id: 1,
    name: 'Osman Gazi',
    title: 'Devlet-i Aliyye-i Osmaniyye\'nin Kurucusu',
    period: '1299-1326',
    image: '/src/assets/muderrisler/osman.jpg',
    description: 'Osman Gazi, Osmanlı İmparatorluğu\'nun kurucusu ve ilk padişahıdır. 1299 yılında Osmanlı Beyliği\'ni kurarak imparatorluğun temellerini atmıştır. Anadolu\'nun fethedilmesinde önemli rol oynamış ve imparatorluğun ilk genişlemesini gerçekleştirmiştir. Adaleti ve hoşgörüsü ile tanınan Osman Gazi, beylikten devlete geçiş sürecinin mimarı olmuştur. Kurduğu adil düzen ve teşkilat yapısı, sonraki nesillere örnek olmuştur. Özellikle gayrimüslimlere karşı gösterdiği hoşgörü ve adil yönetim anlayışı, Osmanlı\'nın çok uluslu yapısının temellerini oluşturmuştur. Şeyh Edebali\'nin "İnsanı yaşat ki devlet yaşasın" düsturunu benimsemiş ve tüm yönetim anlayışını bu ilke üzerine kurmuştur.',
    works: [
      'Osman Gazi Vakfiyesi',
      'İlk Osmanlı Sikkeleri',
      'Söğüt ve Domaniç Teşkilatı'
    ]
  },
  {
    id: 2,
    name: 'Fatih Sultan Mehmed',
    title: 'Ebül-Feth (Fethin Babası)',
    period: '1444-1446, 1451-1481',
    image: '/src/assets/muderrisler/fatih.jpg',
    description: 'Fatih Sultan Mehmed, İstanbul\'un fethiyle tanınan büyük bir Osmanlı padişahıdır. 21 yaşında İstanbul\'u fethederek Bizans İmparatorluğu\'na son vermiş ve Osmanlı İmparatorluğu\'nu Balkanlar\'dan Ortadoğu\'ya genişletmiştir. İlme ve sanata büyük önem veren, yedi dil bilen, matematik ve astronomi alanında eserler veren bir padişahtır. Sahn-ı Seman medreselerini kurarak dönemin en büyük eğitim kompleksini oluşturmuştur. Bilim adamlarını ve sanatçıları sarayında ağırlamış, onlarla bilimsel tartışmalara katılmıştır. Ali Kuşçu gibi dönemin önemli bilim adamlarını İstanbul\'a davet etmiş ve onlara büyük değer vermiştir. Astronomi, matematik, coğrafya ve felsefe alanlarında derin bilgi sahibiydi. Avni mahlasıyla şiirler yazmış, edebiyat alanında da önemli eserler vermiştir. İstanbul\'u fethettikten sonra şehri bir bilim ve kültür merkezi haline getirmiş, farklı dinlere mensup insanların bir arada yaşamasını sağlayan hoşgörü ortamını oluşturmuştur.',
    works: [
      'Avni Divanı',
      'Kanunname-i Ali Osman',
      'Fatih Külliyesi'
    ]
  },
  {
    id: 3,
    name: 'Yavuz Sultan Selim',
    title: 'Hadimül-Haremeyn (Haremeyn\'in Hizmetkarı)',
    period: '1512-1520',
    image: '/src/assets/muderrisler/yavuz.jpg',
    description: 'Yavuz Sultan Selim, Osmanlı İmparatorluğu\'nun en önemli ve etkili padişahlarından biridir. Memlük Sultanlığı\'nı fethederek Mısır\'ı Osmanlı topraklarına katmış ve Safevi İmparatorluğu\'nu yenilgiye uğratmıştır. İmparatorluğun sınırlarını genişleterek Osmanlı\'nın gücünü artırmıştır.',
    works: [
      'Selimi Divanı',
      'Mısır Seferi Günlüğü',
      'Yavuz Sultan Selim Külliyesi'
    ]
  },
  {
    id: 4,
    name: 'Kanuni Sultan Süleyman',
    title: 'Muhibbi (Seven, Dost)',
    period: '1520-1566',
    image: '/src/assets/muderrisler/kanuni.jpg',
    description: 'Kanuni Sultan Süleyman, Osmanlı İmparatorluğu\'nun en uzun süre tahtta kalan ve en etkili padişahlarından biridir. Adaletli yönetimi, sanat ve edebiyata verdiği önem, Osmanlı\'nın altın çağı olarak adlandırılan döneminin simgelerindendir. Avrupa\'da "Muhteşem Süleyman" olarak tanınmıştır.',
    works: [
      'Muhibbi Divanı',
      'Kanuni Kanunnamesi',
      'Süleymaniye Külliyesi'
    ]
  },
  {
    id: 5,
    name: 'Sultan Abdülhamid II',
    title: 'Ulu Hakan',
    period: '1876-1909',
    image: '/src/assets/muderrisler/abdulhamid.jpg',
    description: 'Sultan Abdülhamid II, Osmanlı İmparatorluğu\'nun son dönemlerinde hüküm süren önemli bir padişahtır. Hamidiye Alayları gibi reformlar yapmış, imparatorluğun ekonomik ve siyasi istikrarını sağlamaya çalışmıştır. Eğitime ve modernleşmeye önem vermiş, birçok okul ve hastane inşa ettirmiştir.',
    works: [
      'Hamidiye Külliyesi',
      'Yıldız Sarayı Kütüphanesi',
      'Hamidiye Etfal Hastanesi'
    ]
  },
  {
    id: 6,
    name: 'Mimar Sinan',
    title: 'Ser-mimârân-ı Hâssa (Baş Mimar)',
    period: '1489-1588',
    image: '/src/assets/muderrisler/mimarsinan.jpg',
    description: 'Osmanlı\'nın en büyük mimarı olan Mimar Sinan, 99 yıllık ömrüne 375\'i aşkın yapı sığdırmıştır. Süleymaniye ve Selimiye Camileri başta olmak üzere, köprüler, medreseler, hamamlar ve su kemerleri inşa etmiştir. Mimarlık tarihinin en önemli isimlerinden biri olarak kabul edilir. Çıraklık eseri olarak nitelendirdiği Şehzade Camii, kalfalık eseri Süleymaniye Camii ve ustalık eseri Selimiye Camii ile mimarlık dehasını kanıtlamıştır. Geliştirdiği merkezi kubbe sistemi, akustik hesaplamaları ve su mühendisliği alanındaki yenilikleri ile çağının çok ötesinde bir mimardı. Osmanlı mimarisini zirveye taşıyan Sinan, yapılarında matematik, geometri ve mühendisliği kusursuz bir şekilde harmanlamıştır. Su yolları ve köprü tasarımlarında kullandığı teknikler, günümüzde bile hayranlık uyandırmaktadır. Her yapısında işlevselliği estetikle birleştirmiş, İslam mimarisine yeni bir soluk getirmiştir.',
    works: [
      'Süleymaniye Camii',
      'Selimiye Camii',
      'Şehzade Camii',
      'Mihrimah Sultan Camii'
    ]
  },
  {
    id: 7,
    name: 'Katip Çelebi',
    title: 'Hacı Halife',
    period: '1609-1657',
    image: '/src/assets/muderrisler/celebi.jpg',
    description: 'Osmanlı\'nın en önemli bilim adamı ve düşünürlerinden biridir. Coğrafya, tarih, bibliyografya gibi alanlarda önemli eserler vermiştir. Batı bilimini yakından takip etmiş ve İslam dünyası ile Batı dünyası arasında köprü kurmuştur.',
    works: [
      'Keşf-üz-Zunun',
      'Cihannüma',
      'Mizanü\'l-Hakk',
      'Takvimü\'t-Tevarih'
    ]
  },
  {
    id: 8,
    name: 'Ali Kuşçu',
    title: 'Alâeddin Ali bin Muhammed',
    period: '1403-1474',
    image: '/src/assets/muderrisler/kuscu.jpg',
    description: 'Matematik ve astronomi alanında çığır açan çalışmalar yapmış bir Osmanlı alimidir. Fatih Sultan Mehmed\'in daveti üzerine İstanbul\'a gelmiş ve Ayasofya Medresesi\'nde müderrislik yapmıştır. Astronomi ve matematik alanında birçok önemli eser bırakmıştır.',
    works: [
      'Risale fi\'l-Hey\'e',
      'Risale fi\'l-Hisab',
      'el-Muhammediyye',
      'Şerhu\'t-Tecrid'
    ]
  },
  {
    id: 9,
    name: 'İbni Kemal',
    title: 'Kemalpaşazâde',
    period: '1468-1534',
    image: '/src/assets/muderrisler/ibnikemal.jpg',
    description: 'Osmanlı\'nın en önemli şeyhülislamlarından biridir. Fıkıh, tefsir, tarih ve edebiyat alanlarında 200\'den fazla eser yazmıştır. Yavuz Sultan Selim ve Kanuni Sultan Süleyman dönemlerinde önemli görevlerde bulunmuştur.',
    works: [
      'Tevarih-i Al-i Osman',
      'Risale fi Tahkiki\'l-Gayb',
      'Divan',
      'Yusuf u Züleyha'
    ]
  },
  {
    id: 10,
    name: 'Evliya Çelebi',
    title: 'Seyyah-ı Âlem',
    period: '1611-1682',
    image: '/src/assets/muderrisler/celebi.jpg',
    description: 'Osmanlı\'nın en ünlü seyyahıdır. 40 yılı aşkın süre boyunca Osmanlı İmparatorluğu\'nu ve çevre ülkeleri gezmiş, gördüklerini detaylı bir şekilde kaydetmiştir. Seyahatnamesi, dönemin sosyal ve kültürel hayatına ışık tutan en önemli kaynaklardan biridir.',
    works: [
      'Seyahatname (10 Cilt)',
      'Müfredat',
      'Tarih-i Seyyah'
    ]
  }
];
</script>

<style scoped>
.muderrisler-container {
  padding: 2rem;
  background: linear-gradient(rgba(139, 0, 0, 0.95), rgba(128, 0, 32, 0.95)), url('@/assets/pattern1.png');
  min-height: 100vh;
}

.page-title {
  color: #DAA520;
  font-family: 'Amiri', serif;
  font-size: 3rem;
  text-align: center;
  margin-bottom: 3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-top: 100px;
}

.muderrisler-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.muderris-card {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: 2px solid #DAA520;
  transition: transform 0.3s ease;
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

.muderris-card:hover {
  transform: translateY(-5px);
}

.muderris-image {
  height: 300px;
  overflow: hidden;
}

.muderris-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.muderris-card:hover .muderris-image img {
  transform: scale(1.05);
}

.muderris-content {
  padding: 1.5rem;
}

.muderris-content h3 {
  color: #800020;
  font-family: 'Amiri', serif;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.muderris-title {
  color: #DAA520;
  font-style: italic;
  margin-bottom: 0.5rem;
}

.muderris-period {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.muderris-desc {
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.muderris-works {
  border-top: 1px solid rgba(218, 165, 32, 0.3);
  padding-top: 1rem;
}

.muderris-works h4 {
  color: #800020;
  font-family: 'Amiri', serif;
  margin-bottom: 0.5rem;
}

.muderris-works ul {
  list-style: none;
  padding: 0;
}

.muderris-works li {
  color: #333;
  padding: 0.3rem 0;
  font-style: italic;
}

@media (max-width: 768px) {
  .muderrisler-grid {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .muderris-card {
    min-height: auto;
  }
  
  .muderris-image {
    height: 250px;
  }
}
</style>