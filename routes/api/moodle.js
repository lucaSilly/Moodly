const express = require("express");
const router = express.Router();

var moodle_client = require("moodle-client");

moodle_client.init({
    wwwroot: "http://localhost",
    token: "eae0d0f2897e5ba3e56620929098fbc0"

}).then(function(client) {
    return do_something(client);

}).catch(function(err) {
    console.log("Unable to initialize the client: " + err);
});

function do_something(client) {
    return client.call({
        wsfunction: "core_webservice_get_site_info",

    }).then(function(info) {
        console.log("Hello %s, welcome to %s", info.fullname, info.sitename);
        //console.log(info);
        return;
    });
};



//date d'un cours
router.post("/tpdate", async(req,res)=>{
    try{
        moodle_client.init({
            wwwroot: "http://localhost",
            token: "38786d8eeb535263e5b1de6a494559fa"
        
        }).then(function(client) {
            client.call({
                wsfunction : "core_course_get_contents",
                args: {
                    courseid : req.body.input
                }
            }).then(function(info){
                console.log(info)
                //console.log(info[1].modules[0].dates)
                s = new Date(info[1].modules[0].dates[1].timestamp*1000).toLocaleDateString("fr-eu");
                res.send(info);
                
            });
        }).catch(function(err) {
            console.log("Unable to initialize the client: " + err);
        });

        

    }
    catch(err){
        res.send("Problem on processing your request");
        console.log(err);
    }
});

router.get("/allCourse", async(req,res)=>{
    try{
        moodle_client.init({
            wwwroot: "http://localhost",
            token: "8f320cfcc3d1b96ca326232c0c4b6fc8"
        
        }).then(function(client) {
            client.call({
                wsfunction : "core_enrol_get_users_courses",
                args: {
                    userid : 2
                }
            }).then(function(info){
                console.log(info)
                res.send(info);
                
            });
        }).catch(function(err) {
            console.log("Unable to initialize the client: " + err);
        });

        

    }
    catch(err){
        res.send("Problem on processing your request");
        console.log(err);
    }
});

router.post("/courseId", async(req,res)=>{
    try{
        moodle_client.init({
            wwwroot: "http://localhost",
            token: "0fa7356ff0951dc1f5ddcde639604307"
        
        }).then(function(client) {
            client.call({
                wsfunction : "core_course_search_courses",
                args: {
                    criterianame : 'search',
                    criteriavalue : req.body.input
                }
            }).then(function(info){
                res.send(info);
                
            });
        }).catch(function(err) {
            console.log("Unable to initialize the client: " + err);
        });

        

    }
    catch(err){
        res.send("Problem on processing your request");
        console.log(err);
    }
});


router.post("/allTP", async(req,res)=>{
    try{
        moodle_client.init({
            wwwroot: "http://localhost",
            token: "298ddf95db5822bc3b7a2d69cf399e1e"
        
        }).then(function(client) {
            client.call({
                wsfunction : "core_calendar_get_action_events_by_course",
                args: {
                    courseid : req.body.input
                }
            }).then(function(info){
                //console.log(info);
                res.send(info);
                
            });
        }).catch(function(err) {
            console.log("Unable to initialize the client: " + err);
        });

        

    }
    catch(err){
        res.send("Problem on processing your request");
        console.log(err);
    }
});

router.post ("/tpStatus", async(req,res)=>{
    try{
        moodle_client.init({
            wwwroot: "http://localhost",
            token: "a65b25cb3a96a8cba61046b9e9e6e130"
        
        }).then(function(client) {
            client.call({
                wsfunction : "core_completion_get_activities_completion_status",
                args: {
                    courseid : req.body.input,
                    userid : 2
                }
            }).then(function(info){
                //console.log(info);
                res.send(info);
                
            });
        }).catch(function(err) {
            console.log("Unable to initialize the client: " + err);
        });

        

    }
    catch(err){
        res.send("Problem on processing your request");
        console.log(err);
    }
});
/*
router.get("/coursMod", async(req,res)=>{
    try{
        moodle_client.init({
            wwwroot: "http://localhost",
            token: "a65b25cb3a96a8cba61046b9e9e6e130"
        
        }).then(function(client) {
            client.call({
                wsfunction : "core_course_get_course_module_by_instance",
                args: {
                    instance : 2,
                    name:"testMoodle",
                   
                }
            }).then(function(info){
                //console.log(info);
                res.send(info);
                
            });
        }).catch(function(err) {
            console.log("Unable to initialize the client: " + err);
        });

        

    }
    catch(err){
        res.send("Problem on processing your request");
        console.log(err);
    }
});
*/
module.exports = router;