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
                echo ---[ DEBUG: Current directory ]---
                cd
                echo ---[ DEBUG: Before Cypress ]---
                dir
                npx cypress run ^
                  --reporter mochawesome ^
                  --reporter-options reportDir=reports\\mochawesome,overwrite=false,html=false,json=true
                echo ---[ DEBUG: After Cypress run ]---
                dir reports\\mochawesome
                '''
            }
        }

        stage('Generate Cypress report') {
            steps {
                bat '''
                echo Fusion des rapports JSON et génération HTML...
                dir reports\\mochawesome
                npx mochawesome-merge reports\\mochawesome\\*.json --output reports\\mochawesome\\merged.json
                npx marge reports\\mochawesome\\merged.json ^
                    --reportDir reports\\mochawesome ^
                    --reportFilename cypress-report
                echo ---[ DEBUG: After marge ]---
                dir reports\\mochawesome
                '''
            }
        }

        stage('Run Newman tests') {
            steps {
                bat '''
                echo ---[ DEBUG: Before Newman ]---
                dir
                newman run MOCK_AZIZ_SERVEUR.postman_collection.json ^
                    -r cli,html ^
                    --reporter-html-export reports\\newman\\report.html
                echo ---[ DEBUG: After Newman ]---
                dir reports\\newman
                '''
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
            echo 'Tests exécutés Vérifie les rapports dans le dossier reports/.'
        }
    }
}
