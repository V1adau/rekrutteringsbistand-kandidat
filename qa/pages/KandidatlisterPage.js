/* eslint-disable */
module.exports = {
    elements: {
        kandidatlisterLink: 'a[href="/kandidater/lister"]',
        opprettNyListeKnapp: '#opprett-ny-liste',
        forsteListe: '.Kandidatliste__panel',
        listeNavnInput: '#kandidatliste-navn-input',
        listeBeskrivelseInput: '#kandidatliste-beskrivelse-input',
        listeOppdragsgiverInput: '#kandidatliste-oppdragsgiver-input',
        listeOpprettKnapp: '#kandidatliste-opprett-knapp',
        slettKnapp: '.knapp--hoved',
        listeLagretMelding: '#kandidatliste-lagret-melding',
        listeSlettetMelding: '#kandidatliste-slettet-melding'
    },

    commands: [{
        navigerTilKandidatlister() {
            return this
                .waitForElementVisible('@kandidatlisterLink')
                .click('@kandidatlisterLink')
                .waitForElementVisible('@opprettNyListeKnapp');
        },

        opprettNyListe(navn, beskrivelse, oppdragsgiver) {
            return this
                .click('@opprettNyListeKnapp')
                .waitForElementVisible('@listeNavnInput')
                .setValue('@listeNavnInput', navn)
                .setValue('@listeBeskrivelseInput', beskrivelse)
                .setValue('@listeOppdragsgiverInput', oppdragsgiver)
                .click('@listeOpprettKnapp')
                .waitForElementVisible('@listeLagretMelding');
        },

        slettKandidatlister(navn) {
            let self = this;

            return this
                .waitForElementPresent('@forsteListe')
                .api.useXpath()
                .elements('xpath', `//h2[text()="${navn}"]`, (result) => {
                    const antallLister = result.value.length;
                    for (let i = 0; i < antallLister; i++) {
                        self
                            .click(`//h2[text()="${navn}"]/../../../../..//*[@class="Delete__icon"]`)
                            .waitForElementVisible('@slettKnapp')
                            .clickElement('@slettKnapp', self, 1000)
                            .waitForElementVisible('@listeSlettetMelding')
                            .listerPause(1000);
                    }
                })
                .useCss()
                .page.KandidatlisterPage();
        },

        listerPause(ms) {
            return this.api.pause(ms).page.KandidatlisterPage();
        }
    }]
};
