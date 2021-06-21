const express = require("express");
const cors = require('cors')
const app = express();

//force to return 'incomplete' status until submitted time is hit
//example qstring: remote_subscription_id=999999&ft_complete_after=2020-01-01T00:00:00.007Z
const qstringStatusResp = (request, response) => {
  if(!request.query.remote_subscription_id) {
    response
      .status(404)
      .json()
  } else {
    const ftCompleteAfter = request.query.ft_complete_after && new Date(request.query.ft_complete_after);
    const formtracker_complete = !!(ftCompleteAfter && new Date() > ftCompleteAfter);
    console.log(`formtracker_complete will be ${formtracker_complete}`);
    response
      .json({
          "formtracker_complete": formtracker_complete
      });
  }
};

const realDumbStatusResp = (formtracker_complete) => {
  return (request, response) => {
    console.log(`formtracker_complete will be ${formtracker_complete}`);
    response
      .json({
          "formtracker_complete": formtracker_complete
      });
  }
};


const twoHundred = (request, response) => {
  response.status(200).json();
};

app.use(cors());  //allows from everywhere

//--routes

//testing for mkting v4 - just here to allow for call prior to status
app.post("/orders/nxt", twoHundred);

//two ways to test - if you can supply a qstring with a date to set ok, great.  else, fiddle with this glitch and use realDumbStatusResp
// https://brh-junk-mock-svc.glitch.me/orders/nxt/status
app.get("/orders/nxt/status", qstringStatusResp);
//app.get("/orders/nxt/status", realDumbStatusResp(true));

//app.get("/api/v3/orders/status", statusResp);

// app.get("/api/inboxes/:placeholder", (req, resp) => {
//   resp.json({alright: 'sure'});
// });

//same response for all paths/subpaths on all verbs (if not handled by earlier routes)
app.all("/*", (req, resp) => {
  resp.json({ok: 'whatever'});
});


const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
