Transactions = {
    maxAmount: 999999.99,
    currencyCode: 'USD',
    Purchase: `${window.winkEnvValues.apiEndPoint}/payment/purchase`,
    Session: `${window.winkEnvValues.apiEndPoint}/payment/session`
}
Modes = {
    redirect: 'redirect',
    iFrameOverlay: 'overlayiFrame',
    iFrameEmbedded: 'embeddediFrame'
}