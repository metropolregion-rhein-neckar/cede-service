import * as Koa from "koa"
import * as Router from "koa-router"
import * as klogger from "koa-logger"
import * as kbodyparser from "koa-bodyparser"
import axios, { AxiosResponse } from 'axios'

const config: any = {
    "ckanBaseUrl": "https://daten.digitale-mrn.de",
    "contributorId": "http://dcat-ap.de/def/contributors/metropolregionRheinNeckar",
    "publisherFoafName" : "Metropolregion Rhein-Neckar",
    "publisherId" : "https://www.m-r-n.com",
    "port": 3002
}



const licenses_mapping: any = {

    "apache": "http://dcat-ap.de/def/licenses/apache",
    "bsdlicense": "http://dcat-ap.de/def/licenses/bsd",
    "cc-by": "http://dcat-ap.de/def/licenses/cc-by",
    "cc-by/4.0": "http://dcat-ap.de/def/licenses/cc-by/4.0",
    "cc-by-de/3.0": "http://dcat-ap.de/def/licenses/cc-by-de/3.0",
    "cc-by-nc": "http://dcat-ap.de/def/licenses/cc-by-nc",
    //"cc-by-nc-sa/4.0": "",
    //"cc-by-nc/3.0": "",
    "cc-by-nc-de/3.0": "http://dcat-ap.de/def/licenses/cc-by-nc-de/3.0",
    "cc-by-nc/4.0": "http://dcat-ap.de/def/licenses/cc-by-nc/4.0",
    "cc-by-nd": "http://dcat-ap.de/def/licenses/cc-by-nd",
    "cc-by-nd/3.0": "http://dcat-ap.de/def/licenses/cc-by-nd/3.0",
    "cc-by-nd/4.0": "http://dcat-ap.de/def/licenses/cc-by-nd/4.0",
    "cc-by-sa": "http://dcat-ap.de/def/licenses/cc-by-sa",
    "cc-by-sa-de/3.0": "http://dcat-ap.de/def/licenses/cc-by-sa-de/3.0",
    "cc-by-sa/4.0": "http://dcat-ap.de/def/licenses/cc-by-sa/4.0",
    "ccpdm/1.0": "http://dcat-ap.de/def/licenses/ccpdm/1.0",
    "cc-zero": "http://dcat-ap.de/def/licenses/cc-zero",
    "dl-by-de/1.0": "http://dcat-ap.de/def/licenses/dl-by-de/1.0",
    "dl-by-de/2.0": "http://dcat-ap.de/def/licenses/dl-by-de/2.0",
    "dl-by-nc-de/1.0": "http://dcat-ap.de/def/licenses/dl-by-nc-de/1.0",
    "dl-zero-de/2.0": "http://dcat-ap.de/def/licenses/dl-zero-de/2.0",
    "geoNutz/20130319": "http://dcat-ap.de/def/licenses/geonutz/20130319",
    "geoNutz/20131001": "http://dcat-ap.de/def/licenses/geoNutz/20131001",
    "gfdl": "http://dcat-ap.de/def/licenses/gfdl",
    "gpl/3.0": "http://dcat-ap.de/def/licenses/gpl/3.0",
    "mozilla": "http://dcat-ap.de/def/licenses/mozilla",
    "odc-odbl": "http://dcat-ap.de/def/licenses/odbl",
    "odc-by": "http://dcat-ap.de/def/licenses/odby",
    "odc-pddl": "http://dcat-ap.de/def/licenses/odcpddl",
    "officialWork": "http://dcat-ap.de/def/licenses/officialWork",
    "other-closed": "http://dcat-ap.de/def/licenses/other-closed",
    "other-commercial": "http://dcat-ap.de/def/licenses/other-commercial",
    "other-freeware": "http://dcat-ap.de/def/licenses/other-freeware",
    "other-open": "http://dcat-ap.de/def/licenses/other-open",
    "other-opensource": "http://dcat-ap.de/def/licenses/other-opensource"
}


const format_mapping: any = {
    "CSV": "CSV",
    "GeoJSON": "GEOJSON",
    "GPKG": "GPKG",
    "PDF": "PDF",
    "TXT": "TXT",
    "WFS": "WFS_SRVC",
    "WMS": "WMS_SRVC"
}

const app = new Koa()
const router = new Router()


async function http_get(ctx: Koa.Context, next: any) {


    const ckan_url = config.ckanBaseUrl + "/api/3/action/current_package_list_with_resources?limit=10000"

    const res = await axios.get(ckan_url) as AxiosResponse

    const jsonld = {
        // "__comment": "Version 1.1, 13.08.2020, dcat-ap.de einfache Beispielimplementation - (C) CC BY 4.0 ']init[ AG für GovData'",
        "@context": {
            "dcat": "http://www.w3.org/ns/dcat#",
            "dcatde": "http://dcat-ap.de/def/dcatde/",
            "dct": "http://purl.org/dc/terms/",
            "dcterms": "http://purl.org/dc/terms/",
            "foaf": "http://xmlns.com/foaf/0.1/",
            "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
            "vcard": "http://www.w3.org/2006/vcard/ns#",
            "xsd": "http://www.w3.org/2001/XMLSchema#"
        },
        "@graph": [
            {
                "@id": config.publisherId,
                "@type": "foaf:Organization",
                "foaf:name": config.publisherFoafName
            },
            // TODO: Add catalog
            /*
            {
                "@id": "https://govdata.de#catalog",
                "@type": "dcat:Catalog",
                "dcat:dataset": {
                    "@id": "https://ckan.govdata.de/dataset/d4ce4e6e-ab89-44cb-bf5c-33a162c234de#dataset"
                },
                "dcterms:description": "Das Datenportal für Deutschland - Open Government: Verwaltungsdaten transparent, offen und frei nutzbar.",
                "dcterms:publisher": {
                    "@id": "https://www.govdata.de/web/guest/impressum#publisher"
                },
                "dcterms:title": "GovData"
            },
            */
            /*
            {
                "@id": "_:ub87bL31C21",
                "@type": "vcard:Individual",
                "vcard:fn": "Meister, Thomas, Herr",
                "vcard:hasTelephone": "+49 40 123 45678"
            },
            */
        ]
    }


    const packages = res.data.result


    for (const ckan_dataset of packages) {

        const dcat_keywords = []

        let license = ""

        if (ckan_dataset.license_id in licenses_mapping) {
            license = licenses_mapping[ckan_dataset.license_id]
        }
        else {            
            console.error(ckan_dataset.title + " - Unsupported license ID: " + ckan_dataset.license_id)            
            continue
        }


        for (const tag of ckan_dataset.tags) {
            dcat_keywords.push(tag.display_name)
        }


        const datasetId = config.ckanBaseUrl + "/dataset/" + ckan_dataset.id + "#dataset"


        const dcat_dataset: any = {

            "@id": datasetId,
            "@type": "dcat:Dataset",

            "dct:publisher": {
                "@id": config.publisherId
            },

            "dcatde:contributorID": {
                "@id": config.contributorId
            },

            "dct:description": ckan_dataset.notes,

            "dct:title": ckan_dataset.title,

            "dct:identifier": datasetId,

            "dct:issued": {
                "@type": "xsd:dateTime",
                "@value": ckan_dataset.metadata_created
            },

            "dct:modified": {
                "@type": "xsd:dateTime",
                "@value": ckan_dataset.metadata_modified
            }
        }

        if (dcat_keywords.length > 0) {
            dcat_dataset["dcat:keyword"] = dcat_keywords
        }


        let dcat_theme = null

        for (const kvp of ckan_dataset.extras) {
            if (kvp.key == "dcat-ap-theme") {
                dcat_theme = kvp.value
                break
            }
        }

        if (dcat_theme != null) {

            dcat_dataset["dcat:theme"] = {
                "@id": dcat_theme
            }
        }

        const distributions = Array<any>()



        for (const res of ckan_dataset.resources) {


            let format = ""

            if (res.format in format_mapping) {
                format = format_mapping[res.format]
            }
            else {
                console.error("Unsupported format: " + res.format)
                continue
            }

            const distId = `${config.ckanBaseUrl}/dataset/${ckan_dataset.id}/resource/${res.id}#distribution`

            const dcat_distribution: any = {
                "@id": distId,
                "@type": "dcat:Distribution",

                // TODO: Complete

                "dcat:accessURL": {
                    "@id": distId
                },

                "dcat:downloadURL": {
                    "@id": res.url
                },

                "dct:license": {
                    "@id": license
                },

                "dct:format": {
                    "@id": "http://publications.europa.eu/resource/authority/file-type/" + format
                },

                "dct:title": ckan_dataset.title + " (" + res.format + ")",

                "dct:modified": {
                    "@type": "xsd:dateTime",
                    "@value": res.metadata_modified
                },

                "dct:description": ckan_dataset.notes,

            }


            distributions.push({ "@id": distId })

            jsonld["@graph"].push(dcat_distribution)
        }

        dcat_dataset["dcat:distribution"] = distributions



        jsonld["@graph"].push(dcat_dataset)


    }

    ctx.body = jsonld
    ctx.type = "application/ld+json"

    ctx.status = 200

    await next()
}










async function init() {


    router.get("", http_get)



    const bodyParserConfig: kbodyparser.Options = {
        enableTypes: ['json', 'text'],
        extendTypes: { 'json': ['application/ld+json'] },
        jsonLimit: "100mb",
        textLimit: "100mb"
    }


    app.use(klogger())
    app.use(kbodyparser(bodyParserConfig))

    //############# BEGIN Set HTTP Headers ###############                
    app.use(async (ctx: any, next: any) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        ctx.set('Access-Control-Allow-Methods', 'GET');
        await next();
    });
    //############# END Set CORS Headers ###############

    app.use(router.routes()).use(router.allowedMethods())


    // Start HTTP server:
    app.listen(config.port, () => {
        console.log("CKAN-DCAT-AP wrapper started. Listening on port " + config.port + ".")
    })
}


init()

