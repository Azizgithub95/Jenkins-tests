pipeline {
    agent any

    environment {
        PATH = "${env.PATH};C:\\Program Files\\nodejs"
    }

    stages {
        stage('Install dependencies') {
            steps {
                bat 'npm install'
                bat 'npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator'
                bat 'npm install -g newman newman-reporter-html'
            }
        }

        stage('Run Cypress tests') {
            steps {
                bat 'echo ---[ DEBUG: Before Cypress ]---'
                bat 'npx cypress run --reporter mochawesome --reporter-options reportDir=reports\\mochawesome,overwrite=false,html=false,json=true'
            }
        }

        stage('Generate Cypress report') {
            steps {
                bat 'echo Fusion des rapports JSON et génération HTML...'
                bat 'npx mochawesome-merge reports/mochawesome/*.json --output reports/mochawesome/merged.json'
                bat 'npx marge reports/mochawesome/merged.json --reportDir reports/mochawesome --reportFilename cypress-report.html'
            }
        }

        stage('Run Newman tests') {
            steps {
                bat 'echo ---[ DEBUG: Before Newman ]---'
                bat 'if not exist reports\\newman mkdir reports\\newman'
                bat 'newman run MOCK_AZIZ_SERVEUR.postman_collection.json -r cli,html --reporter-html-export reports\\newman\\report.html'
                bat 'echo [INFO] Newman finished.'
            }
        }

        stage('Run K6 tests') {
            steps {
                bat 'k6 run test_k6.js'
            }
        }
    }

    post {
        always {
            echo 'Tests exécutés. Vérifie les rapports dans le dossier reports/.'
            publishHTML (target: [
                reportName: 'Cypress Report',
                reportDir: 'reports/mochawesome',
                reportFiles: 'cypress-report.html',
                alwaysLinkToLastBuild: true
            ])
            publishHTML (target: [
                reportName: 'Newman Report',
                reportDir: 'reports/newman',
                reportFiles: 'report.html',
                alwaysLinkToLastBuild: true
            ])
        }
    }
}
pipeline {
  agent any

  // Si vous avez défini un NodeJS tool dans Jenkins, vous pouvez l'utiliser ici :
  // tools { nodejs 'NodeJS_14' }

  environment {
    // Vous pouvez également ajouter Node dans le PATH via un outil plutôt qu’en dur
    PATH = "${env.PATH};C:\\Program Files\\nodejs"
    REPORTS_DIR = 'reports'
  }

  options {
    // Pour conserver les logs et les rapports plus longtemps
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
            bat 'k6 run test_k6.js --out json=${REPORTS_DIR}\\k6\\k6-result.json'
          }
        }
      }
    }

    stage('Generate Reports') {
      steps {
        script {
          // Fusion et génération Cypress
          bat """
            echo Fusion des rapports JSON Cypress et génération HTML...
            npx mochawesome-merge ${REPORTS_DIR}/mochawesome/*.json --output ${REPORTS_DIR}/mochawesome/merged.json
            npx marge ${REPORTS_DIR}/mochawesome/merged.json ^
              --reportDir ${REPORTS_DIR}/mochawesome ^
              --reportFilename cypress-report.html
          """

          // (Optionnel) Convertir le JSON K6 en HTML via k6-to-html si installé
          bat """
            if exist ${REPORTS_DIR}\\k6 mkdir ${REPORTS_DIR}\\k6
            echo Génération du rapport K6 HTML...
            npx k6-to-html ${REPORTS_DIR}/k6/k6-result.json ${REPORTS_DIR}/k6/k6-report.html || echo "k6-to-html non installé"
          """
        }
      }
    }
  }

  post {
    always {
      echo '📂 Publication des rapports HTML...'

      publishHTML (target: [
        reportName: 'Cypress Report',
        reportDir: "${REPORTS_DIR}/mochawesome",
        reportFiles: 'cypress-report.html',
        alwaysLinkToLastBuild: true
      ])

      publishHTML (target: [
        reportName: 'Newman Report',
        reportDir: "${REPORTS_DIR}/newman",
        reportFiles: 'newman-report.html',
        alwaysLinkToLastBuild: true
      ])

      publishHTML (target: [
        reportName: 'K6 Report',
        reportDir: "${REPORTS_DIR}/k6",
        reportFiles: 'k6-report.html',
        alwaysLinkToLastBuild: true
      ])
    }

    failure {
      echo '❌ Un ou plusieurs tests ont échoué.'
    }
  }
}
