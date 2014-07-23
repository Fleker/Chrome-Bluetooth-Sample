setTimeout(function() {
    errorHandler = function() {
        console.error("Error happened");   
    }
    var chosenFileEntry = null;
    document.getElementById('input').addEventListener('click', function(e) {
        console.log(9);
        chrome.fileSystem.chooseEntry({type: 'openFile'}, function(readOnlyEntry) {
            readOnlyEntry.file(function(file) {
                var reader = new FileReader();
                console.log("Got file");
                reader.readAsDataURL(file);
                reader.onerror = errorHandler;
                reader.onloadend = function(e) {
                    console.log(e.target.result);
                    console.log("file parsed");   
                    document.getElementById('inputstream').src = e.target.result;
                };
                console.log(file);
                window.message = file;
            });
        });
    });

    //Saving
    document.getElementById('output').addEventListener('click', function(e) {
        chrome.fileSystem.chooseEntry({type: 'saveFile'}, function(writableFileEntry) {
            writableFileEntry.createWriter(function(writer) {
              writer.onerror = errorHandler;
              writer.onwriteend = function(e) {
                  console.log(writer);
                  //Get file url
                console.log('write complete');
                  var reader = new FileReader();
                  reader.onloadend = function(e) {
                    app.getElementById('outputstream').src = e.result;   
                  };
                  reader.readAsDataURL(file);

              };
              writer.write(new Blob(['1234567890'], {type: 'text/plain'}));
            }, errorHandler);
        });
    });
}, 1000);

//
 //VIA https://developer.chrome.com/apps/app_bluetooth
app = window.document;
            chrome.bluetooth.getAdapterState(function(adapter) {
              console.log("Adapter " + adapter.address + ": " + adapter.name);
            });
            
            var powered = false;
            chrome.bluetooth.getAdapterState(function(adapter) {
              powered = adapter.powered;
            });

            chrome.bluetooth.onAdapterStateChanged.addListener(
              function(adapter) {
                  console.log(adapter);
                if (adapter.powered != powered) {
                  powered = adapter.powered;
                  if (powered) {
                    console.log("Adapter radio is on");
                  } else {
                    console.log("Adapter radio is off");
                  }
                }
              });
            device_names = {};
            var updateDeviceName = function(device) {
                console.log("+", device);
                device_names[device.address] = device.name;
                try {
                    app.getElementById("devicenames").innerHTML = "";
                } catch(e) {
                    //Try again soon
                    setTimeout(function() {
                        updateDeviceName(device);
                    },1000);
                    return;
                }
                for(var i in device_names) {
                    app.getElementById("devicenames").innerHTML += "<div class='deviceitem' data-address='"+i+"'>-"+device_names[i]+" ["+i+"]</div>";
                }
                var devicelist = app.getElementsByClassName("deviceitem");
                for(var i in devicelist) {
                    if(i != parseInt(i))
                        continue;
                    console.log(i);
                    devicelist[i].addEventListener('click', function() {
//                        console.log("Devicelist "+i+" "+this.dataset.address);
                        connectTo(this.dataset.address); 
                    });
                }
            };
            var removeDeviceName = function(device) {
                console.log("-", device);
              delete device_names[device.address];
            }

            // Add listeners to receive newly found devices and updates
            // to the previously known devices.
            chrome.bluetooth.onDeviceAdded.addListener(updateDeviceName);
            chrome.bluetooth.onDeviceChanged.addListener(updateDeviceName);
            chrome.bluetooth.onDeviceRemoved.addListener(removeDeviceName);

            // With the listeners in place, get the list of devices found in
            // previous discovery sessions, or any currently active ones,
            // along with paired devices.
            chrome.bluetooth.getDevices(function(devices) {
              for (var i = 0; i < devices.length; i++) {
                updateDeviceName(devices[i]);
              }
            });

            // Now begin the discovery process.
        function discovery() {
            console.log("Starting device discovery");
            chrome.bluetooth.startDiscovery(function() {
              // Stop discovery after 30 seconds.
                console.log("discover button");
                try {
                    app.getElementById("discovery").innerHTML = "Discovering";
                    app.getElementById("discovery").disabled = true;
                } catch(E) {
                    setTimeout(function() {
                        app.getElementById("discovery").innerHTML = "Discovering";
                        app.getElementById("discovery").disabled = true;
                    },1000);
                }
            setTimeout(function() {
                  app.getElementById("discovery").innerHTML = "Discover Devices";
                  app.getElementById("discovery").disabled = false;
                  app.getElementById("discovery").onclick = function() {
                      discovery();
                  };
                chrome.bluetooth.stopDiscovery(function() { console.log("Discovery Ends") });
              }, 30000);
            });
        }
        discovery();


        var onConnectedCallback = function() {
//            console.log("The connectTo was called back", chrome.runtime.lastError.message);
          if (chrome.runtime.lastError) {
              console.log(chrome.runtime.lastError);
              console.log("Connection failed: " + chrome.runtime.lastError.message);
              app.getElementById("bluetoothconnect").innerHTML = "Could not connect. "+chrome.runtime.lastError.message+".";
          } else {
            // Profile implementation here.
              console.log("Profile Implementation");
//            app.getElementById('bluetoothconnect').innerHTML = "Successfully connected to "+device_names[address];
            app.getElementById('bluetoothconnect').innerHTML = "Successfully connected => No Address In Message";
            app.getElementById('service').disabled = false;
            app.getElementById('devicenames').setAttribute('class', 'disabled');
              app.getElementById('service').addEventListener('click', function() {
                console.log("click");
                startService(); 
              });
              app.getElementById('disconnect').addEventListener('click', function() {
                chrome.bluetoothSocket.disconnect(window.socketId);        
                  app.getElementById('bluetoothstatus').innerHTML = "Nothing doing";
                  app.getElementById('bluetoothconnect').innerHTML = "Not connected";
                  app.getElementById('service').disabled = false;
                  app.getElementById('disconnect').disabled = true;
              });
          }
        };


    //"49aca6e6-0596-11e4-8f46-b2227cce2b54", "49aca9f2-0596-11e4-8f46-b2227cce2b54", 
    function connectTo(address) {
        app.getElementById("bluetoothconnect").innerHTML = "Trying to establish connection to "+device_names[address];
        console.log("connectTo "+device_names[address]);
        var uuid = 1105;
        var uuid = "fa87c0d0-afac-11de-8a39-0800200c9a66";
        var uuid = "00001101-0000-1000-8000-00805f9b34fb";
        var uuid = "0x1101";
        var uuid = "cc8894db-f550-4a33-8a02-fd8a99fe38fb"
        var uuid = "00001101-0000-1000-8000-00805f9b34fb";
        var uuid = "1101"   ;
        //  
        
//        var onConnectedCallback = function() {
//            console.log("The connectTo was called back", chrome.runtime.lastError.message);
//          if (chrome.runtime.lastError) {
//              console.log(chrome.runtime.lastError);
//              console.log("Connection failed: " + chrome.runtime.lastError.message);
//              app.getElementById("bluetoothconnect").innerHTML = "Could not connect. "+chrome.runtime.lastError.message+".";
//          } else {
//            // Profile implementation here.
//              console.log("Profile Implementation");
//            app.getElementById('bluetoothconnect').innerHTML = "Successfully connected to "+device_names[address];
//            app.getElementById('service').disabled = false;
//            app.getElementById('devicenames').setAttribute('class', 'disabled');
//              app.getElementById('service').addEventListener('click', function() {
//                console.log("click");
//                startService(); 
//              });
//              app.getElementById('disconnect').addEventListener('click', function() {
//                chrome.bluetoothSocket.disconnect(window.socketId);        
//                  app.getElementById('bluetoothstatus').innerHTML = "Nothing doing";
//                  app.getElementById('bluetoothconnect').innerHTML = "Not connected";
//                  app.getElementById('service').disabled = false;
//                  app.getElementById('disconnect').disabled = true;
//              });
//          }
//        };

        chrome.bluetoothSocket.create(function(createInfo) {
            window.socketId = createInfo.socketId;
            console.log(uuid, createInfo, address);
          chrome.bluetoothSocket.connect(createInfo.socketId,
            address, uuid, onConnectedCallback);
        });   
    }
    function startService() {
        console.log("Starting...");
        app.getElementById('bluetoothstatus').innerHTML = "Starting Connection";
        app.getElementById('disconnect').disabled = false;
        sendMessage(str2ab("Hello"));
    }
    function sendMessage(data) {
       chrome.bluetoothSocket.send(window.socketId, data, function(bytes_sent) {
          if (chrome.runtime.lastError) {
            console.log("Send failed: " + chrome.runtime.lastError.message);
              app.getElementById("bluetoothstatus").innerHTML = chrome.runtime.lastError.message;
          } else {
            console.log("Sent " + bytes_sent + " bytes");
              app.getElementById("bluetoothstatus").innerHTML = "Sent "+bytes_sent+" bytes";
          }
        });
    }

    chrome.bluetoothSocket.onReceive.addListener(function(receiveInfo) {
      if (receiveInfo.socketId != socketId) {
          app.getElementById("bluetoothstatus").innerHTML = "Got data from wrong socket";
        return;
      }
      // receiveInfo.data is an ArrayBuffer.
        app.getElementById("bluetoothstatus").innerHTML = "Received "+ab2str(receiveInfo);
    });
    chrome.bluetoothSocket.onReceiveError.addListener(function(errorInfo) {
      // Cause is in errorInfo.error.
      console.log(errorInfo.errorMessage);
        app.getElementById("bluetoothstatus").innerHTML = errorInfo.errorMessage;
    });
    function ab2str(buf) {
       return String.fromCharCode.apply(null, new Uint16Array(buf));
     }
    function str2ab(str) {
       var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
       var bufView = new Uint16Array(buf);
       for (var i=0, strLen=str.length; i<strLen; i++) {
         bufView[i] = str.charCodeAt(i);
       }
       return buf;
     }
 /*//BLUETOOTH SERVICES
    //RFCOMM
    function onListenCallback(channel, psm, backlog) {
        console.log(channel, psm, backlog, "RF");   
    }
    function onListenCallback2(channel, psm, backlog) {
        console.log(channel, psm, backlog, "L2");   
    }
    function onSendCallback(data) {
        console.log(data);   
    }
    var uuid = "fa87c0d0-afac-11de-8a39-0800200c9a66";
    chrome.bluetoothSocket.create(function(createInfo) {
      chrome.bluetoothSocket.listenUsingRfcomm(createInfo.socketId,
        uuid, onListenCallback);
    });
    //L2CAP
    var uuid = "fa87c0d0-afac-11de-8a39-0800200c9a66";
//    var uuid = '0b87367c-f188-47cd-bc20-a5f4f70973c6';
    chrome.bluetoothSocket.create(function(createInfo) {
      chrome.bluetoothSocket.listenUsingL2cap(createInfo.socketId,
        uuid, onListenCallback2);
    });
    //ACCEPT CLIENT Connections
    chrome.bluetoothSocket.onAccept.addListener(function(acceptInfo) {
        console.log("Hey look, a client connection");
        console.log(acceptInfo);
      if (info.socketId != serverSocketId)
        return;

      // Say hello...
      chrome.bluetoothSocket.send(acceptInfo.clientSocketId,
        data, onSendCallback);

      // Accepted sockets are initially paused,
      // set the onReceive listener first. 
      chrome.bluetoothSocket.onReceive.addListener(onReceive);
      chrome.bluetoothSocket.setPaused(false);
    });*/