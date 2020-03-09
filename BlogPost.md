# REST Web-App Development Using Express and Neo4j

When building a web application there are a lot of choices for the database which you will put on the bottom of the stack. As the source of truth you want to use a database which is dependable certainly, but which also allows you to model your data well. In this article, I’ll discuss why Neo4j is a good choice as your web application stack’s foundation if your data model contains lot of connected data and relationships.

## What is Neo4j?

![Figure 1. Neo4j Web Console](img_1.png)

Neo4j is a Graph database which means, simply, that rather than data being stored in tables or collections it is stored as nodes and relationships between nodes. In Neo4j both nodes and relationships can contain properties with values. In addition:

- Nodes can have zero or more **labels** (like Author or Book)
- Relationships have exactly one **type** (like WROTE or FRIEND_OF)
- Relationships are always directed from one node to another (but can be queried regardless of direction)

## Why Neo4j?

To start thinking about choosing a database for a web application we should consider what it is that we want. Top criteria include:

- Is it easy to use?
- Will it let you easily respond to changes in requirements?
- Is it capable of high performance queries?
- Does it allow for easy data modelling?
- Is it transactional?
- Does in scale?
- Is it fun (sadly an often overlooked quality in a database)?

In this respect Neo4j fits the bill nicely. Neo4j...

- Has its own easy-to-learn query language (called **_Cypher_**)
- Is schema-less, which allows it to be whatever you want it to be
- Can perform queries on highly related data (graph data) much faster than traditional databases
- Has an entity and relationship structure which naturally fits human intuition
- Supports ACID-compliant transactions
- Has a High Availability mode for query throughput scaling, backups, data locality, and redundancy.
- Has a visual query console which is hard to get tired of

## When to not use Neo4j?

While Neo4j, as a Graph NoSQL database, has a lot to offer, no solution can be perfect. Some use cases where Neo4j isn’t as good of a fit:

- Recording large amounts of event-based data (such as log entries or sensor data)
- Large scale distributed data processing like with Hadoop
- Binary data storage
- Structured data that’s a good candidate to be stored in a relational database

In the example above you can see a graph of Authors, Cities, Books, and Categories as well as the relationships that tie them together. If you wanted to use Cypher to show that result in the Neo4j web console you could execute the following:

```
MATCH
(city:City)<-[:LIVES_IN]-(:Author)-[:WROTE]->
(book:Book)-[:HAS_CATEGORY]->(category:Category)
WHERE city.name = “Chicago”
RETURN \*
```

Note the ASCII-art syntax showing nodes surrounded by parenthesis and an arrow representing the relationship pointing from one node to the other. This is Cypher’s way of allowing you to match a given subgraph pattern.

Of course Neo4j isn’t just about showing pretty graphs. If you wanted to count the categories of books by the location (city) of the author, you can use the same **MATCH** pattern and just return a different a set of columns, like so:

```
MATCH
(city:City)<-[:LIVES_IN]-(:Author)-[:WROTE]->
(book:Book)-[:HAS_CATEGORY]->(category:Category)
RETURN city.name, category.name, COUNT(book)
```

That would return the following:

| city.name | category.name | COUNT(category) |
| --------- | ------------- | --------------- |
| Chicago   | Fantasy       | 1               |
| Chicago   | Non-Fiction   | 2               |

While Neo4j can handle "big data" it isn't Hadoop, HBase or Cassandra and you won't typically be crunching massive (petabyte) analytics directly in your Neo4j database. But when you are interested in serving up information about an entity and its data neighborhood (like you would when generating a web-page or an API result) it is a great choice. From simple CRUD access to a complicated, deeply nested view of a resource.

**Which stack should you use with Neo4j?**

All major programming languages have support for Neo4j via the HTTP API, either via a basic HTTP library or via a number of native libraries which offer higher level abstractions. Also, since Neo4j is written in Java, all languages which have a JVM interface can take advantage of the high-performance APIs in Neo4j.

Neo4j also has its own “stack” to allow to you choose different access methods ranging from easy access to raw performance. It offers:

- A HTTP API for making Cypher queries and retrieving results in JSON
- An "unmanaged extension" facility in which you can write your own endpoints for your Neo4j database
- A Java API for specifying traversals of nodes and relationships at a higher level
- A low level batch-loading API for massive initial data ingestion
- A core Java API for direct access to nodes and relationships for maximum performance

Traditionally in a decently sized web application a number of database calls are needed to populate the HTTP response. Even if you can execute queries in parallel, it is often necessary to get the results of one query before you can make a second to get related data. In SQL you can generate complicated and expensive joins on tables to get results from many tables in one query, but anybody who has done more than a couple of SQL joins in the same query knows how quickly that can get complicated. Not to mention that the database still needs to do table or index scans to get the associated data. In Neo4j, retrieving entities via relationships uses pointers directly to the related nodes so that the server can traverse right to where it needs to go.

That said, there are a couple of downsides to this approach. While it’s possible to retrieve all of the data required in one query, the query is quite long. I haven’t yet found a way to modularize it for reuse. Along the same lines: we might want to use this same endpoint in another place but show some more information about the related Gists. We could modify the query to return that data but then it would be returning unnecessary data for the original use case.

We are fortunate today to have many excellent database choices. While Relational databases are still the best choice for storing structured data, NoSQL databases are a good choice for managing semi-structured, unstructured, and graph data. If you have a data model with lot of connected data and want a database which is intuitive, fun, and fast you should get to know Neo4j.

Sample CRUD application with Express+Neo4j is available in [github](https://github.com/gulmoharnnt/ExpressNeo4jCRUD)

