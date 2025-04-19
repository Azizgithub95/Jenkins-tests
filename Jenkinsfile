pipeline {
    agent any

    environment {
        REPORTS_DIR = "reports"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                bat 'npm install'
                bat 'npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator'
                bat 'npm install -g newman newman-reporter-html'
            }
        }

        stage('Run Cypress tests') {
            steps {
                bat '''
                npx cypress run ^
                  --reporter mochawesome ^
                  --reporter-options reportDir=reports\\mochawesome,overwrite=false,html=false,json=true
                '''
            }
        }

        stage('Generate Cypress report') {
            steps {
                bat '''
                npx mochawesome-merge reports\\mochawesome\\*.json > reports\\mochawesome\\merged.json
                npx marge reports\\mochawesome\\merged.json --reportDir reports\\mochawesome --reportFilename cypress-report
                '''
            }
        }

        stage('Run Newman tests') {
            steps {
                bat '''
                newman run "MOCK AZIZ SERVEUR.postman_collection.json" ^
                  -r cli,html ^
                  --reporter-html-export reports\\newman\\newman-report.html
                '''
            }
        }

        stage('Run K6 tests') {
            steps {
                bat 'npm run test:k6'
            }
        }
    }

    post {
        always {
            echo "Tests exécutés. Vérifie les rapports dans le dossier reports/."
        }
    }
}
