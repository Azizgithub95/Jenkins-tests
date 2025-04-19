pipeline {
    agent any

    stages {
        stage('Préparation') {
            steps {
                echo 'On prépare le 1ER build...'
            }
        }

        stage('Build') {
            steps {
                echo 'On build...'
            }
        }

        stage('Tests') {
            steps {
                echo 'On lance les tests...'
            }
        }

        stage('Newman - Postman Tests') {
            steps {
                echo 'Lancement des tests Postman avec Newman...'
                bat 'newman run "MOCK AZIZ SERVEUR.postman_collection.json"'
            }
        }
          stage('K6 - Performance Testing') {
            steps {
                echo 'Lancement du test de performance avec K6...'
                bat 'npm run test:k6'
            }
        }
        stage('Cypress') {
            steps {
                echo 'Lancement des tests 1 Cypress...'
                bat 'npm install'
                bat 'npm run cypress:run'
            }
        }
    }
}
