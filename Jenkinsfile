pipeline {
    agent any

    environment {
        // Si besoin, ajustez le chemin vers votre installation de Node.js sur l’agent Windows
        PATH = "C:\\Program Files\\nodejs;${env.PATH}"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                // Installe les dépendances via npm
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
                          --reporter-options reportDir=reports\\cypress,reportFilename=cypress-report,overwrite=false,html=true,json=false
                        """
                    }
                }
                stage('Newman') {
                    steps {
                        echo '--- RUN Newman ---'
                        bat """
                        if not exist reports\\newman mkdir reports\\newman
                        newman run MOCK_AZIZ_SERVEUR.postman_collection.json ^
                          -r html ^
                          --reporter-html-export reports\\newman\\newman-report.html
                        """
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
                // Déclare un rapport HTML Cypress
                publishHTML([
                    reportDir:    'reports\\cypress',
                    reportFiles:  'cypress-report.html',
                    reportName:   'Cypress Report',
                    keepAll:      true,
                    alwaysLinkToLastBuild: true
                ])
                // Déclare un rapport HTML Newman
                publishHTML([
                    reportDir:    'reports\\newman',
                    reportFiles:  'newman-report.html',
                    reportName:   'Newman Report',
                    keepAll:      true,
                    alwaysLinkToLastBuild: true
                ])
            }
        }
    }

    post {
        always {
            echo 'Build terminé.'
        }
    }
}
