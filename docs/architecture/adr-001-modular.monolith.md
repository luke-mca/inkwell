### ADR-001: Use a Modular Monolith with a Three-Tier Client-Server Architecture
**Status:** Accepted
##### Context
*Inkwell* is a one-semester course project. A small team will 
build it step by step. The project already uses React, Expres
s, PostgreSQL, and Prisma.
We need an architecture that is easy to build and maintain. I
t should support gradual development throughout the course. I
t should also avoid unnecessary complexity. At the same time, 
it should allow the system to grow in the future if needed.
##### Decision
*Inkwell* will use a **three-tier client-server architecture*
*.- **Presentation tier:** A React single-page application.- **Logic tier:** A single Express server organized as a **mo
dular monolith** with three layers:- Routes- Services- Repositories- **Data tier:** A PostgreSQL database accessed only through 
the Repository layer using Prisma.
The client and server can be deployed separately. However, th
e server remains a single application.
##### Alternatives Considered
**Microservices**- Rejected because they add unnecessary complexity.- They slow down development.- Their scalability benefits are not needed for a project of 
this size.
**Server-rendered Monolith**- Rejected because the server would generate the web pages.- It does not follow the client-server architecture introduce
d earlier in the course.- It also does not teach students how separate frontend and b
ackend applications work together.
**Pipe-and-Filter or Event-Driven Architecture**- Rejected as the main architecture.- *Inkwell* mainly handles user requests and server response
s.- It is not a data-processing pipeline.- Event-driven ideas may still be used for individual feature
s. For example, publishing a post could trigger a notificatio
n to followers. This would not change the overall architectur
e.
##### Consequences
**Positive**- Supports fast and gradual development.
Keeps the code organized and easier to maintain.- Makes it easier to separate features, such as search or not
ifications, into their own services if the project grows.
**Negative**- The Express server is a single deployment.- If the server crashes, all API features become unavailable.- This is an acceptable trade-off for this project.- We can revisit this decision if the system later requires h
igher availability.