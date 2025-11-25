<template>
  <div class="footer1 mt-80 md:mt-40 sm:mt-40">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 col-md-6">
          <div class="logo" :to="`/`">
            <img src="@/assets/main-logo.png" style="max-width: 180px" alt="interview9.id" />
          </div>
          <div class="heading1 mt-16">
            <p>
              <b>interview9.id</b> merupakan portal berita/media online yang berada di bawah naungan
              <b>PT. Sinar Berlian Mediatama</b>.
            </p>
            <div class="footer-social1">
              <ul>
                <li>
                  <a href="#"><i class="fa-brands fa-instagram"></i></a>
                </li>
                <li>
                  <a href="#"><i class="fa-brands fa-youtube"></i></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6 mb-50 sm:mb-30 sm:mt-30">
          <div class="footer-list1 ml-80 md:ml-0 sm:ml-0">
            <h3>Link Terkait</h3>
            <ul>
              <li><router-link :to="'/post/tentang-kami'">Tentang Kami </router-link></li>
              <li>
                <router-link :to="'/post/kode-etik-jurnalistik'"
                  >Kode Etik Jurnalistik
                </router-link>
              </li>
              <li>
                <router-link :to="'/post/pedoman-media-siber'">Pedoman Media Siber </router-link>
              </li>
              <li><router-link :to="'/post/tim-redaksi'">Tim Redaksi </router-link></li>
            </ul>
          </div>
        </div>

        <div class="col-lg-4 col-md-6">
          <div class="footer-contact-list1 mb-50 sm:mb-30">
            <h3>Kontak Kami</h3>
            <div class="footer-contact-box1">
              <div class="icon">
                <img src="@/assets/img/icons/footer1-icon1.svg" alt="interview9.id" />
              </div>
              <div class="text">
                <a href="mailto:redaksiinterview9@gmail.com">redaksiinterview9@gmail.com</a>
              </div>
            </div>

            <div class="footer-contact-box1">
              <div class="icon">
                <img src="@/assets/img/icons/footer1-icon2.svg" alt="interview9.id" />
              </div>
              <div class="text">
                <a href="#">
                  Jl. Karang Anyar I Komplek Villa Anyar Utama No. 31 RT. 43 RW. 01 <br />
                  Kelurahan Loktabat Utara, <br />
                  Kecamatan Banjarbaru Utara, Kota Banjarbaru <br />
                </a>
              </div>
            </div>

            <div class="footer-contact-box1">
              <div class="icon">
                <img src="@/assets/img/icons/footer1-icon3.svg" alt="interview9.id" />
              </div>
              <div class="text">
                <a href="#">0895-7005-36506</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="coppyrihgt1">
        <div class="row coppyrihgt-border">
          <div class="col-md-12">
            <p class="coppyrihgt">© 2025 interview9.id, PT. Sinar Berlian Mediatama.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
