pipeline {
    agent any

    environment {
        PATH = "${env.PATH};C:\\Program Files\\nodejs\\"
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
                mkdir reports\\mochawesome
                echo Running Cypress tests...
                npx cypress run ^
                  --reporter mochawesome ^
                  --reporter-options reportDir=reports/mochawesome,overwrite=true,html=false,json=true
                '''
                bat 'dir reports\\mochawesome'
            }
        }

        stage('Generate Cypress report') {
            steps {
                bat '''
                echo Merging Cypress JSON reports...
                npx mochawesome-merge reports/mochawesome/*.json --output reports/mochawesome/merged.json

                echo Génération du rapport HTML Cypress...
                npx marge reports/mochawesome/merged.json ^
                    --reportDir reports/mochawesome ^
                    --reportFilename cypress-report.html
                '''
                bat 'dir reports\\mochawesome'
            }
        }

        stage('Run Newman tests') {
            steps {
                bat '''
                mkdir reports\\newman
                echo Lancement des tests Newman...
                newman run MOCK_AZIZ_SERVEUR.postman_collection.json ^
                    -r cli,html ^
                    --reporter-html-export reports/newman/report.html
                '''
                bat 'dir reports\\newman'
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
        }
    }
}
