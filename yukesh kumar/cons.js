var express = require('express');
var opn = require('opn');
const bodyParser = require('body-parser');

var AWS = require("aws-sdk");
  app = express(),
  port = process.env.PORT || 3000;

  AWS.config.update({
    region: 'ap-south-1',
    accessKeyId: 'AKIA4SMXHTFOBOLPX5NF',
    secretAccessKey: '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'
  });

  var cloudformation = new AWS.CloudFormation();

  app.use(bodyParser.urlencoded({ extended: true })); 


  app.get('/',function(req,res){
      res.sendFile(__dirname + '/index.html')
  });

  app.post('/done', (req, res) => {
    let data = require('../v2.yaml');

    data.Parameters.KeyName.Default = req.body.Keypair
     data.Parameters.InstanceType.Default = req.body.InstanceType
     data.Parameters.DBName.Default = req.body.DBName
     data.Parameters.DBUser.Default = req.body.DBuser
     data.Parameters.DBPassword.Default = req.body.DBpassword
     data.Parameters.DBRootPassword.Default = req.body.DBrootpassword
     data.Parameters.SSHLocation.Default = req.body.SSHLocation

    
    var params = {
        StackName: req.body.stackname,
        DisableRollback: false,
        TemplateBody: YAML+.stringify(data)
      };
      cloudformation.createStack(params, function(err, data) {
        if (err) console.log(err);

        cloudformation.waitFor('stackCreateComplete',{StackName: req.body.stackname },function(err,data){
            if(err) console.log(err);
            else{ 
            res.sendFile(__dirname + '/index1.html')
            opn(data.Stacks[0].Outputs[0].OutputValue);
          }
        })
        
      }); 
   });

app.listen(port);