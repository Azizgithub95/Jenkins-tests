pipeline {
  agent any

  environment {
    PATH         = "${env.PATH};C:\\Program Files\\nodejs"
    REPORTS_DIR  = 'reports'
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '20'))
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install dependencies') {
      steps {
        bat """
          npm ci
          npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator k6-to-html
          npm install -g newman newman-reporter-html
        """
      }
    }

    stage('Run Tests') {
      parallel {
        stage('Cypress') {
          steps {
            bat """
              echo ---[ DEBUG: Cypress ]---
              npx cypress run ^
                --reporter mochawesome ^
                --reporter-options reportDir=${REPORTS_DIR}\\mochawesome,overwrite=false,html=false,json=true
            """
          }
        }

        stage('Newman') {
          steps {
            bat """
              echo ---[ DEBUG: Newman ]---
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
              echo ---[ DEBUG: K6 ]---
              if not exist ${REPORTS_DIR}\\k6 mkdir ${REPORTS_DIR}\\k6
              # Génère directement le HTML via l’option html native
              k6 run test_k6.js --out html=${REPORTS_DIR}\\k6\\k6-report.html
            """
          }
        }
      }
    }

    stage('Generate Reports') {
      steps {
        bat """
          echo Fusion et génération du rapport Cypress…
          npx mochawesome-merge ${REPORTS_DIR}\\mochawesome\\*.json --output ${REPORTS_DIR}\\mochawesome\\merged.json
          npx marge ${REPORTS_DIR}\\mochawesome\\merged.json ^
            --reportDir ${REPORTS_DIR}\\mochawesome ^
            --reportFilename cypress-report.html
        """
      }
    }
  }

  post {
    always {
      echo '📂 Publication des rapports HTML…'
      publishHTML target: [
        reportName            : 'Cypress Report',
        reportDir             : "${REPORTS_DIR}/mochawesome",
        reportFiles           : 'cypress-report.html',
        alwaysLinkToLastBuild : true
      ]
      publishHTML target: [
        reportName            : 'Newman Report',
        reportDir             : "${REPORTS_DIR}/newman",
        reportFiles           : 'newman-report.html',
        alwaysLinkToLastBuild : true
      ]
      publishHTML target: [
        reportName            : 'K6 Report',
        reportDir             : "${REPORTS_DIR}/k6",
        reportFiles           : 'k6-report.html',
        alwaysLinkToLastBuild : true
      ]
    }
    failure {
      echo '❌ Un ou plusieur tests ont échoué.'
    }
  }
}
