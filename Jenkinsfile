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
        sh 'newman run "MOCK AZIZ SERVEUR.postman_collection.json"'
    }
}



    }
}
