pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        // récupère ton repo
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        bat 'npm ci'
      }
    }

    stage('Run Tests') {
      parallel {
        stage('Cypress') {
          steps {
            echo '--- RUN Cypress ---'
            // on génère un HTML unique nommé cypress-report.html
            bat """
              npx cypress run ^
                --reporter mochawesome ^
                --reporter-options reportDir=reports\\cypress,reportFilename=cypress-report,overwrite=false,html=true,json=false
            """
          }
        }

        stage('Newman') {
          steps {
            echo '--- RUN Newman ---'
            bat 'if not exist reports\\newman mkdir reports\\newman'
            // reporter HTML natif
            bat 'newman run MOCK_AZIZ_SERVEUR.postman_collection.json -r html --reporter-html-export reports\\newman\\newman-report.html'
          }
        }

        stage('K6') {
          steps {
            echo '--- RUN K6 (no report) ---'
            bat 'k6 run test_k6.js'
          }
        }
      }
    }
  }

  post {
    always {
      // publication du rapport Cypress
      publishHTML target: [
        reportDir   : 'reports\\cypress',
        reportFiles : 'cypress-report.html',
        reportName  : 'Cypress Report',
        keepAll     : true,
        allowMissing: false
      ]
      // publication du rapport Newman
      publishHTML target: [
        reportDir   : 'reports\\newman',
        reportFiles : 'newman-report.html',
        reportName  : 'Newman Report',
        keepAll     : true,
        allowMissing: false
      ]
    }
  }
}
