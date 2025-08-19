<template>
  <div class="sobre-remix-page">
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <div class="hero-text">
              <h1 class="display-4 fw-bold text-dark mb-4">Sobre Remix</h1>
              <p class="text-muted mb-0">
                Remix es una empresa que se apoya en encontrar entre las características y la funcionalidad a las disposiciones
                remix.
              </p>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="hero-illustration text-center">
              <div class="illustration-container">
                <div class="hero-image-placeholder">
                  <img
                    :src="valorPortada"
                    alt="Hero illustration"
                    class="hero-image"
                    width="474.947265625"
                    height="474.947265625"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="values-section">
      <div class="container">
        <div class="row g-4 mb-5">
          <div class="col-lg-4 col-md-6">
            <div class="value-card text-start header-card">
              <h2 class="display-5 fw-bold text-dark mb-3">Nuestros valores</h2>
              <p class="text-muted mb-0">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
              </p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="value-card text-center">
              <div class="value-icon mb-4">
                <img :src="valor1" alt="Improvement icon" class="icon-image" width="250" height="142" />
              </div>
              <h5 class="fw-semibold text-dark">Siempre lo podemos hacer mejor</h5>
            </div>
          </div>

          <div class="col-lg-4 col-md-6">
            <div class="value-card text-center">
              <div class="value-icon mb-4">
                <img :src="valor2" alt="Improvement icon" class="icon-image" width="250" height="142" />
              </div>
              <h5 class="fw-semibold text-dark">Nunca dejamos a un remixero solo</h5>
            </div>
          </div>

          <div class="col-lg-4 col-md-6">
            <div class="value-card text-center">
              <div class="value-icon mb-4">
                <img :src="valor3" alt="Improvement icon" class="icon-image" width="250" height="142" />
              </div>
              <h5 class="fw-semibold text-dark">Actuamos con coherencia</h5>
            </div>
          </div>

          <div class="col-lg-4 col-md-6">
            <div class="value-card text-center">
              <div class="value-icon mb-4">
                <img :src="valor4" alt="Improvement icon" class="icon-image" width="250" height="142" />
              </div>
              <h5 class="fw-semibold text-dark">Aseguramos impacto mediante formación continua</h5>
            </div>
          </div>

          <div class="col-lg-4 col-md-6">
            <div class="value-card text-center">
              <div class="value-icon mb-4">
                <img :src="valor5" alt="Improvement icon" class="icon-image" width="250" height="142" />
              </div>
              <h5 class="fw-semibold text-dark">El éxito siempre es compartido</h5>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="cta-buttons text-center">
              <button class="btn btn-primary me-3">Link</button>
              <button class="btn btn-outline-primary">Link</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import valor1 from '@/assets/rx-valores-01.png'
import valor2 from '@/assets/rx-valores-02.png'
import valor3 from '@/assets/rx-valores-03.png'
import valor4 from '@/assets/rx-valores-04.png'
import valor5 from '@/assets/rx-valores-05.png'
import valorPortada from '@/assets/valores-portada-01.png'

export default {
  name: 'SobreRemix',
  data() {
    return {
      valor1,
      valor2,
      valor3,
      valor4,
      valor5,
      valorPortada
    }
  },
  methods: {}
}
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');

$primary: #7749f8;
$secondary: #6c757d;
$success: #28a745;
$danger: #dc3545;
$warning: #ffc107;
$info: #17a2b8;

$primary-dark: #5227cc;
$primary-light: #ebe5fc;
$secondary-dark: #54595e;
$secondary-light: #abb5be;

$gray: #adb5bd;
$gray-100: #f8f9fa;
$gray-600: #6c757d;
$gray-800: #343a40;
$white: #ffffff;

$font-family-base: 'Inter', sans-serif;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

.sobre-remix-page {
  font-family: $font-family-base;
  line-height: 1.2;
  color: $gray-600;
  background: $gray-100;
}

.hero-section {
  background: $gray-100;
  padding: 100px 0;
  position: relative;
}

.hero-text {
  h1 {
    font-size: 52px;
    font-weight: $font-weight-bold;
    line-height: 1.2;
    color: $gray-800;
    margin-bottom: 24px;
  }

  p {
    font-size: 15px;
    line-height: 1.5;
    color: $gray;
    font-weight: $font-weight-normal;
  }
}

.hero-illustration {
  .illustration-container {
    position: relative;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;

    .hero-image-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

// Imagen responsiva
.hero-image {
  max-width: 100%;
  height: auto;
  display: block;
}

// Iconos de valores responsivos
.icon-image {
  max-width: 100%;
  height: auto;
  display: block;
}

.values-section {
  padding: 80px 0;
  background: $gray-100;
}

.section-header {
  h2 {
    font-size: 52px;
    font-weight: $font-weight-bold;
    color: $gray-800;
    line-height: 1.2;
  }

  p {
    font-size: 15px;
    color: $gray;
    font-weight: $font-weight-normal;
    line-height: 1.5;
  }
}

.value-card {
  padding: 30px 20px;
  height: 100%;
  background: $white;
  border-radius: 12px;

  &.header-card {
    background: transparent;
    padding-left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  .value-icon {
    display: flex;
    justify-content: center;

    .icon-illustration {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  h5 {
    font-size: 16px;
    font-weight: $font-weight-semibold;
    color: $gray-800;
    line-height: 1.3;
    margin: 0;
  }

  h2 {
    font-size: 40px;
    font-weight: $font-weight-bold;
    color: $gray-800;
    line-height: 1.2;
    margin-bottom: 24px;
  }

  p {
    font-size: 15px;
    color: $gray;
    font-weight: $font-weight-normal;
    line-height: 1.5;
  }
}

.btn {
  font-family: $font-family-base;
  font-weight: $font-weight-semibold;
  font-size: 16px;
  line-height: 17px;
  padding: 10px 16px;
  border-radius: 6px;
  white-space: nowrap;
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &.btn-primary {
    background-color: $primary;
    border-color: $primary;
    color: $white;

    &:hover {
      background-color: $primary-dark;
      border-color: $primary-dark;
      transform: translateY(-2px);
    }
  }

  &.btn-outline-primary {
    background-color: transparent;
    border-color: $primary;
    color: $primary;

    &:hover {
      background-color: $primary;
      border-color: $primary;
      color: $white;
      transform: translateY(-2px);
    }
  }
}

.display-4 {
  font-family: Inter !important;
  font-size: 40px !important;
  font-weight: 600 !important;
  line-height: 100% !important;
  color: #343a40 !important;
}

.display-5 {
  font-family: Inter !important;
  font-size: 28px !important;
  font-weight: 600 !important;
  line-height: 100% !important;
  color: #343a40 !important;
}

.text-muted {
  color: #adb5bd !important;
  font-family: Inter !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  line-height: 100% !important;
}

.value-card h5.fw-semibold {
  font-family: Inter !important;
  font-size: 20px !important;
  font-weight: 400 !important;
  line-height: 100% !important;
  align-content: center !important;
  color: #343a40 !important;
}

.fw-bold {
  font-weight: $font-weight-bold !important;
}

.fw-semibold {
  font-weight: $font-weight-semibold !important;
}

.text-dark {
  color: $gray-800 !important;
}

// Media queries mejoradas para móvil
@media (max-width: 991.98px) {
  .hero-section {
    padding: 80px 0;
    text-align: center;
  }

  .hero-text {
    text-align: center;

    h1 {
      font-size: 40px;
    }
  }

  .hero-illustration {
    margin-top: 40px;

    .illustration-container {
      height: 250px;
    }
  }

  .hero-image {
    max-width: 80%;
  }

  .value-card {
    h2 {
      font-size: 32px;
    }

    &.header-card {
      padding-left: 20px;
      text-align: center;
      align-items: center;
    }
  }

  .display-4 {
    font-size: 40px !important;
  }

  .display-5 {
    font-size: 28px !important;
  }

  .values-section {
    padding: 60px 0;
  }

  .icon-image {
    max-width: 80%;
  }
}

@media (max-width: 767.98px) {
  .hero-section {
    padding: 60px 0;
    text-align: center;
  }

  .hero-text {
    text-align: center;

    h1 {
      font-size: 32px;
    }
  }

  .hero-illustration {
    .illustration-container {
      height: 200px;
    }
  }

  .hero-image {
    max-width: 70%;
  }

  .display-4 {
    font-size: 32px !important;
  }

  .values-section {
    padding: 50px 0;
  }

  .value-card {
    text-align: center;

    &.header-card {
      text-align: center;
      align-items: center;
      padding-left: 20px;
    }
  }

  .icon-image {
    max-width: 70%;
  }

  .cta-buttons {
    .btn {
      display: block;
      width: 100%;
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

@media (max-width: 575.98px) {
  .hero-section {
    padding: 50px 0;
    text-align: center;
  }

  .hero-text {
    text-align: center;
    padding: 0 15px;

    h1 {
      font-size: 28px;
    }

    p {
      font-size: 14px;
    }
  }

  .hero-illustration {
    margin-top: 30px;

    .illustration-container {
      height: 150px;
    }
  }

  .hero-image {
    max-width: 60%;
  }

  .display-4 {
    font-size: 28px !important;
  }

  .values-section {
    padding: 40px 0;
  }

  .value-card {
    padding: 25px 15px;
    text-align: center;

    &.header-card {
      text-align: center;
      align-items: center;
      padding: 25px 15px;
    }

    h5 {
      font-size: 15px;
    }

    h2 {
      font-size: 24px;
    }

    p {
      font-size: 14px;
    }
  }

  .icon-image {
    max-width: 60%;
  }

  .section-header {
    p {
      font-size: 14px;
    }
  }

  .cta-buttons {
    padding: 0 15px;
  }
}

// Media query adicional para pantallas muy pequeñas
@media (max-width: 375px) {
  .hero-image {
    max-width: 50%;
  }

  .icon-image {
    max-width: 50%;
  }

  .hero-text h1 {
    font-size: 24px;
  }

  .value-card {
    &.header-card h2 {
      font-size: 20px;
    }
  }
}
</style>
