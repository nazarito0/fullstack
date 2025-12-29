pipeline {
    agent {
        node {
            label 'slave_j'
        }
    }

    stages {
        stage('build') {
            steps {
                echo '--------start build--------'
                echo '--------end build--------'
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

        stage("Quality Gate"){
            steps {
                script {
            timeout(time: 1, unit: 'HOURS') { // Just in case something goes wrong, pipeline will be killed after a timeout
                def qg = waitForQualityGate() // Reuse taskId previously collected by withSonarQubeEnv
                if (qg.status != 'OK') {
                    error "Pipeline aborted due to quality gate failure: ${qg.status}"
                }
            }
        }}}
    }
}
