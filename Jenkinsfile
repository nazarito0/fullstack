pipeline {
    agent {
        node {
            label 'slave_j'
        }
    }

    stages {
        stage('Build app') {
            steps {
                echo '--------start build--------'

                dir('frontend') {
                    echo 'Building Frontend...'
                    sh 'npm install'
                }
                
                dir('backend') {
                    echo 'Building Backend...'
                    sh 'npm install'
                }

                echo '--------end build--------'
            }
        }

        stage('Test') { 
            steps {
                echo '--------start test--------'
                sh 'bash ./scripts/test.sh'
                echo '--------end test--------'
            }
        }

        stage('Deliver') {
            steps {
                echo '--------start delivery--------'
                sh 'bash ./scripts/deliver.sh'
                echo '--------end delivery--------'
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

        environment {
        FRONTEND_IMAGE = "nazarito0/fullstack-frontend"
        BACKEND_IMAGE  = "nazarito0/fullstack-backend"
        BUILD_TAG      = "${env.BUILD_NUMBER}"
        }

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/nazarito0/fullstack'
            }
        }

        stage('Build frontend image') {
            steps {
                script {
                    def frontendImage = docker.build("${FRONTEND_IMAGE}:${BUILD_TAG}", "./frontend")
                    frontendImage.push()
                    frontendImage.push('latest')
                }
            }
        }

        stage('Build backend image') {
            steps {
                script {
                    def backendImage = docker.build("${BACKEND_IMAGE}:${BUILD_TAG}", "./backend")
                    backendImage.push()
                    backendImage.push('latest')
                }
            }
        }

        //stage('Push images') {
        //    steps {
        //        script {
        //            docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
        //                dockerImage.push()
        //        }
        //    }
        //}}
    }
}
