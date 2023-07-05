import { $jsonld, date, toRule } from "@metascraper/helpers";
import { RuleBundle } from "metascraper";

const toDate = toRule(date);

export const publishedScraper = (): RuleBundle => ({
  published: [
    // From: http://ogp.me/#type_article
    toDate($jsonld("datePublished")),
    toDate($jsonld("dateCreated")),
    toDate(($) => $('meta[property*="published_time" i]').attr("content")),
    toDate(($) => $('meta[property*="release_date" i]').attr("content")),
    toDate(($) => $('meta[name="date" i]').attr("content")),
    toDate(($) => $('[itemprop="datepublished" i]').attr("content")),
    toDate(($) => $('[itemprop*="date" i]').attr("content")),
    toDate(($) => $('time[itemprop*="date" i]').attr("datetime")),
    toDate(($) => $("time[datetime]").attr("datetime")),
    toDate(($) => $("time[datetime][pubdate]").attr("datetime")),
    toDate(($) => $('meta[name*="dc.date" i]').attr("content")),
    toDate(($) => $('meta[name*="dc.date.issued" i]').attr("content")),
    toDate(($) => $('meta[name*="dc.date.created" i]').attr("content")),
    toDate(($) => $('meta[name*="dcterms.date" i]').attr("content")),
    toDate(($) => $('[property*="dc:date" i]').attr("content")),
    toDate(($) => $('[property*="dc:created" i]').attr("content")),
  ],
});
