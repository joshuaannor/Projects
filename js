const http = require('http')
const fs = require('fs')
const serviceConfigs = fs.readFileSync('serviceConfigs.json')
const settings = JSON.parse(fs.readFileSync('settings.json'))
const purecss = fs.readFileSync('./public/pure.css', 'utf8')
const favicon = fs.readFileSync('./public/favicon.ico')
const html = require('./lib/htmlhelperV2')

function addStatusTags(svcConfigArray) {
    let returnArray = svcConfigArray.slice()
    return returnArray.map(entry => {
        entry["statusCode"] = -1
        entry["statusTimestamp"] = new Date()
        return entry
    })
}

function fullURL(serviceEntry) {
    return `http://${serviceEntry.httpOptions.hostname == 'localhost' ? settings.myIp : serviceEntry.httpOptions.hostname}:${serviceEntry.httpOptions.port || 80}${serviceEntry.httpOptions.path}`
}

let services = addStatusTags(JSON.parse(serviceConfigs))

function makeRequest(serviceEntry) {
    var req = http.request(serviceEntry.httpOptions, function (res) {
        var responseBody = ''

        res.on("data", function (chunk) {
            responseBody += chunk.toString()
        })

        res.on("end", function () {
            serviceEntry.statusTimestamp = new Date()
            serviceEntry.responseBody = responseBody
            serviceEntry.statusCode = res.statusCode
        })
    })
    if (serviceEntry.requestBody) req.write(JSON.stringify(serviceEntry.requestBody))
    req.end()

    req.on("error", err => {
        console.log(err.message)
        serviceEntry.statusCode = -1
        serviceEntry.responseBody = err.message
    })
}

function refreshStatuses() {
    services.forEach(entry => {
        makeRequest(entry)
    })
}

function EnvColor(env) {
    if (env == 'PROD')
        return '#00ffbf'
    if (env == 'QA')
        return '#996666'
    if (env == 'STAGING')
        return '#ffff80'
    if (env == 'DEV')
        return '#ccccb3'
    return '#8080ff'
}

refreshStatuses()

setInterval(() => { refreshStatuses() }, settings.statusRefreshIntervalMs || 300000)

function genServiceStatusTable(servicesArray) {
    let tableRows = ''
    servicesArray.forEach(serviceEntry => {
        tableRows += html.element('tr',
            html.element('td', serviceEntry.environment, { style: `text-align:center; background-color:${EnvColor(serviceEntry.environment)};` }) +
            html.element('td', serviceEntry.name) +
            html.element('td', serviceEntry.statusCode, { style: `text-align:center;${serviceEntry.statusCode == 200 ? "background-color:#7fe296;" : "background-color:#ff9b9b;"}` }) +
            html.element('td', new Date().getTime() - serviceEntry.statusTimestamp.getTime()) +
            html.element('td', html.element('a', fullURL(serviceEntry), { href: fullURL(serviceEntry), target: '_blank' })) +
            html.element('td', html.element('a', serviceEntry.statusCode != 200 ? serviceEntry.responseBody : "SUCCESS"))
        )
    })
    return html.element('table',
        html.element('thead',
            html.element('tr',
                html.element('th', "Environment") +
                html.element('th', "Service Name") +
                html.element('th', "Status Code") +
                html.element('th', "Updated (X ms ago)") +
                html.element('th', "URL") +
                html.element('th', "Response Body")
            )
        ) +
        html.element('tbody', tableRows), { class: "pure-table pure-table-bordered" })
}

http.createServer((i, o) => {
    console.log('Request Received')
    switch (i.url) {
        case '/favicon.ico':
            o.setHeader('Content-Type', 'image/x-icon')
            o.end(favicon)
            break
        case '/data':
            o.end(JSON.stringify(services, null, 4))
            break
        default:
            let htmlResponse = html.Html(
                html.Head(html.Style(purecss)) +
                html.Title("Automation Services") +
                html.Body(genServiceStatusTable(services))
            )
            o.end(htmlResponse)
    }
}).listen(settings.httpPort, () => {
    console.log(`Server running on host http://localhost:${settings.httpPort}`)
})
