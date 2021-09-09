class SPARQL {
  constructor(baseurl) {
    this.baseurl = baseurl;
  }
  async sparql(query) {
    const url = `${this.baseurl}?query=${encodeURIComponent(query)}`;
    const json = await (await fetch(url)).json();
    return json;
  }
  async sparqlItem(query) {
    const json = await this.sparql(query);
    return json.results.bindings[0];
  }
  async sparqlItems(query) {
    const json = await this.sparql(query);
    return json.results.bindings;
  }
  values(json) {
    const name = json.head.vars[0];
    return json.results.bindings.map(d => d[name].value);
  };
  cutType(json) {
    if (Array.isArray(json)) {
      return json.map(d => this.cutType(d));
    } else {
      const d = json;
      Object.keys(d).forEach(key => d[key] = d[key].value);
      return d;
    }
  };
  async getTypes() {
    const query = "select distinct ?o { ?s a ?o. } order by ?o";
    return this.values(await this.sparql(query));
  };
  async getProperties() {
    const query = `select distinct ?p { ?s ?p ?o. } order by ?p`;
    return this.values(await this.sparql(query));
  };
  async getItems(uri, n = 10) {
    //const query = `select ?s { ?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <${uri}>. } order by rand() limit 10`;
    //const query = `select ?s { ?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <${uri}>. } limit 10`;
    const query = `select ?p ?o { ?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <${uri}>. ?s ?p ?o } limit ${n}`;
    return await this.sparql(query);
  };
  async getItem(uri) {
    const query = `select * { <${uri}> ?p ?o. }`;
    return await this.sparql(query);
  };
}

export { SPARQL };
