pipeline {
    agent {
        node {
            label 'slave_j'
        }
    }

    stages {
        stage('build') {
            steps {
                echo 'build test'
            }
        }

        stage('SonarQube analysis') {
            environment {
            def scannerHome = tool 'sonarqube_scaner';
            }
            steps {
            withSonarQubeEnv('sonarqube_server') { // If you have configured more than one global server connection, you can specify its name
                sh "${scannerHome}/bin/sonar-scanner"
            }
            }
        }
    }
}
