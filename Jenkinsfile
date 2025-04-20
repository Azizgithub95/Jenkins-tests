pipeline {
  agent any

  environment {
    // Chemin vers Node.js si besoin
    PATH = "${env.PATH};C:\\Program Files\\nodejs"
    REPORTS_DIR = 'reports'
  }

  options {
    // Conserver les 20 derniers builds et afficher les timestamps
    buildDiscarder(logRotator(numToKeepStr: '20'))
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        bat """
          npm ci
          npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator
          npm install -g newman newman-reporter-html
        """
      }
    }

    stage('Run Tests') {
      parallel {
        stage('Cypress') {
          steps {
            bat """
              echo ---[ DEBUG: Before Cypress ]---
              npx cypress run ^
                --reporter mochawesome ^
                --reporter-options reportDir=${REPORTS_DIR}\\mochawesome,overwrite=false,html=false,json=true
            """
          }
        }

        stage('Newman') {
          steps {
            bat """
              echo ---[ DEBUG: Before Newman ]---
              if not exist ${REPORTS_DIR}\\newman mkdir ${REPORTS_DIR}\\newman
              newman run MOCK_AZIZ_SERVEUR.postman_collection.json ^
                -r cli,html ^
                --reporter-html-export ${REPORTS_DIR}\\newman\\newman-report.html
            """
          }
        }

        stage('K6') {
          steps {
            bat """
              if not exist ${REPORTS_DIR}\\k6 mkdir ${REPORTS_DIR}\\k6
              k6 run test_k6.js --out json=${REPORTS_DIR}\\k6\\k6-result.json
            """
          }
        }
      }
    }

    stage('Generate Reports') {
      steps {
        bat """
          echo Fusion des rapports JSON Cypress et génération HTML...
          npx mochawesome-merge ${REPORTS_DIR}/mochawesome/*.json --output ${REPORTS_DIR}/mochawesome/merged.json
          npx marge ${REPORTS_DIR}/mochawesome/merged.json ^
            --reportDir ${REPORTS_DIR}/mochawesome ^
            --reportFilename cypress-report.html

          echo Génération du rapport K6 HTML (si k6-to-html installé)...
          npx k6-to-html ${REPORTS_DIR}/k6/k6-result.json ${REPORTS_DIR}/k6/k6-report.html || echo "k6-to-html non installé"
        """
      }
    }
  }

  post {
    always {
      echo '📂 Publication des rapports HTML...'

      publishHTML target: [
        reportName         : 'Cypress Report',
        reportDir          : "${REPORTS_DIR}/mochawesome",
        reportFiles        : 'cypress-report.html',
        alwaysLinkToLastBuild: true
      ]

      publishHTML target: [
        reportName         : 'Newman Report',
        reportDir          : "${REPORTS_DIR}/newman",
        reportFiles        : 'newman-report.html',
        alwaysLinkToLastBuild: true
      ]

      publishHTML target: [
        reportName         : 'K6 Report',
        reportDir          : "${REPORTS_DIR}/k6",
        reportFiles        : 'k6-report.html',
        alwaysLinkToLastBuild: true
      ]
    }

    failure {
      echo '❌ Un ou plusieur tests ont échoué.'
    }
  }
}
