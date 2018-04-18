@Library('deploy')
import deploy

def deployLib = new deploy()

node {
    def commitHashShort, committer, releaseVersion

    def app = "pam-kandidatsok"
    def appConfig = "nais.yaml"
    def dockerRepo = "repo.adeo.no:5443"
    def groupId = "nais"
    def environment = 't1'
    def zone = 'sbs'
    def namespace = "default"

    stage("checkout") {
        deleteDir()
        checkout scm

        commitHashShort = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        committer = sh(script: 'git log -1 --pretty=format:"%an"', returnStdout: true).trim()

        releaseVersion = "0.0.${env.BUILD_NUMBER}-${commitHashShort}"

        echo "release version: ${releaseVersion}"
    }

    stage("npm install") {
        withEnv(['HTTPS_PROXY=http://webproxy-utvikler.nav.no:8088', 'HTTP_PROXY=http://webproxy-utvikler.nav.no:8088', 'NO_PROXY=localhost,127.0.0.1,maven.adeo.no', 'NODE_TLS_REJECT_UNAUTHORIZED=0', 'PORT=8081']) {
            sh "npm install"
        }
    }

    stage("Build") {
        sh "npm run build"
        sh "docker build --build-arg version=${releaseVersion} --build-arg app_name=${app} -t ${dockerRepo}/${app}:${releaseVersion} ."
    }

    stage("Publish") {
        withCredentials([usernamePassword(credentialsId: 'nexusUploader', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
            sh "docker login -u ${env.NEXUS_USERNAME} -p ${env.NEXUS_PASSWORD} ${dockerRepo} && docker push ${dockerRepo}/${app}:${releaseVersion}"
            sh "curl --user ${env.NEXUS_USERNAME}:${env.NEXUS_PASSWORD} --upload-file ${appConfig} https://repo.adeo.no/repository/raw/nais/${app}/${releaseVersion}/nais.yaml"
        }
    }

    stage('Deploy to preprod') {
        callback = "${env.BUILD_URL}input/Deploy/"
        def deploy = deployLib.deployNaisApp(app, releaseVersion, environment, zone, namespace, callback, committer).key
        try {
            timeout(time: 15, unit: 'MINUTES') {
                input id: 'deploy', message: "Check status here:  https://jira.adeo.no/browse/${deploy}"
            }
        } catch (Exception e) {
            throw new Exception("Deploy feilet :( \n Se https://jira.adeo.no/browse/" + deploy + " for detaljer", e)

        }
    }
}
