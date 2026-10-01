pipeline {
    agent any

    environment {
        PROJECT_NAME   = 'devops-test'
        DEPLOY_URL     = 'https://thuandvl.github.io/devops-test-thuan/'
        IMAGE_NAME     = 'devops-test-thuan'
        CONTAINER_NAME = 'devops-web'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Checkout OK - branch main"
            }
        }

        stage('Notify Start') {
            steps {
                script {
                    sendTelegram("""🚀 DEPLOY STARTED
Project: ${PROJECT_NAME}
Branch: main""")
                }
            }
        }

        stage('Install dependencies') {
            steps {
                sh '''
                    docker run --rm \
                      -v "$WORKSPACE":/app \
                      -w /app \
                      node:22-alpine \
                      npm install
                '''
            }
        }

        stage('Build project') {
            steps {
                sh '''
                    docker run --rm \
                      -v "$WORKSPACE":/app \
                      -w /app \
                      node:22-alpine \
                      npm run build
                    ls -la dist
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker rm -f ${CONTAINER_NAME} || true
                    docker build -t ${IMAGE_NAME} .
                    docker run -d --name ${CONTAINER_NAME} -p 8081:80 ${IMAGE_NAME}
                    echo "Deployed successfully"
                    echo "Local: http://localhost:8081"
                    echo "URL: ${DEPLOY_URL}"
                '''
            }
        }
    }

    post {
        success {
            script {
                sendTelegram("""✅ DEPLOY SUCCESS
Project: ${PROJECT_NAME}
Branch: main
URL: ${DEPLOY_URL}""")
            }
        }
        failure {
            script {
                sendTelegram("""❌ DEPLOY FAILED
Project: ${PROJECT_NAME}
Branch: main
Please check Jenkins.""")
            }
        }
    }
}

def sendTelegram(String message) {
    try {
        withCredentials([
            string(credentialsId: 'TELEGRAM_BOT_TOKEN', variable: 'TOKEN'),
            string(credentialsId: 'TELEGRAM_CHAT_ID', variable: 'CHAT_ID')
        ]) {
            sh """
                curl -s -X POST "https://api.telegram.org/bot\${TOKEN}/sendMessage" \
                  --data-urlencode "chat_id=\${CHAT_ID}" \
                  --data-urlencode "text=${message}"
            """
        }
    } catch (err) {
        echo "Telegram skipped (chua cau hinh credentials): ${err}"
    }
}
