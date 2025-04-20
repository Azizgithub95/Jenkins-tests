pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
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
            bat """
              npx cypress run ^
                --reporter mochawesome ^
                --reporter-options reportDir=reports\\\\cypress,reportFilename=cypress-report,overwrite=false,html=true,json=false
            """
            // Affiche le contenu du dossier pour s'assurer que le HTML est là
            bat 'dir reports\\\\cypress'
          }
        }

        stage('Newman') {
          steps {
            echo '--- RUN Newman ---'
            bat 'if not exist reports\\newman mkdir reports\\newman'
            bat """
              newman run MOCK_AZIZ_SERVEUR.postman_collection.json ^
                -r html ^
                --reporter-html-export reports\\\\newman\\\\newman-report.html
            """
            bat 'dir reports\\\\newman'
          }
        }

        stage('K6 (no report)') {
          steps {
            echo '--- RUN K6 (no report) ---'
            bat 'k6 run test_k6.js'
          }
        }
      }
    }

    stage('Publish Reports') {
      steps {
        publishHTML([
          reportDir              : 'reports/cypress',
          reportFiles            : 'cypress-report.html',
          reportName             : 'Cypress Report',
          keepAll                : true,
          alwaysLinkToLastBuild  : true,
          allowMissing           : false
        ])
        publishHTML([
          reportDir              : 'reports/newman',
          reportFiles            : 'newman-report.html',
          reportName             : 'Newman Report',
          keepAll                : true,
          alwaysLinkToLastBuild  : true,
          allowMissing           : false
        ])
      }
    }
  }

  post {
    always {
      echo 'Build terminé'
    }
  }
}
