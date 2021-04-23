//var ModbusRTU = require("modbus-serial");
//var client = new ModbusRTU();

// client.connectRTUBuffered("COM3", { baudRate: 38400 });
// client.setID(1);
// client.setTimeout(1000);

const serialport = require('serialport')

/*const serialport = require('serialport'),
    portName = 'COM3',
    sp = new serialport(portName, {
        baudRate: 38400});
*/


var selected_port = "";

function start_modbus()
{
    client.connectRTUBuffered(selected_port, { baudRate: 38400 });
    client.setID(1);
    client.setTimeout(1000);
}

const tableify = require('tableify')


function abab() {
    var data;

    sp.on('open', function () {
        console.log('Serial Port OPEN');
        sp.on('data', function (data) {
            console.log("Valueaa Test", data[0]);

        });
    });
    document.getElementById('serial_data').innerHTML = "data[0]";
};

// list of meter's id
const metersIdList = [1, 2, 3, 4, 5];
 
const getMetersValue = async (meters) => {
    try{
        // get value of all meters
        for(let meter of meters) {
            // output value to console
            console.log(await getMeterValue(meter));
            // wait 100ms before get another device
            await sleep(100);
    }
    } catch(e){
        // if error, handle them here (it should not)
        console.log(e)
    } finally {
        // after get all data from salve repeate it again
        setImmediate(() => {
            getMetersValue(metersIdList);
        })
    }
}
 
const getMeterValue = async (id) => {
    try {
        // set ID of slave
        //await client.setID(id);
        // read the 1 registers starting at address 0 (first register)
        let val =  await client.readHoldingRegisters(50, 2);
        // return the value
        return val.data;
    } catch(e){
        // if error return -1
        return -1
    }
}
 
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// start get value
//getMetersValue(metersIdList);

async function getData(){
    await client.writeRegisters(50, [0x0004 , 0x0005]);
    await sleep(100);
    console.log("Success");
}

async function seral_port_list(){
    var connect_com_port = await serialport.list();
    var port_list_option = "";

    for (var i in connect_com_port){
        port_list_option += "<option value=" + connect_com_port[i].path + ">" + connect_com_port[i].path + "</option>";
        console.log(connect_com_port[i].path);
    }
    document.getElementById('port_list').innerHTML = port_list_option;

    // await serialport.list().then((ports, err) => {
    //     if(err) {
    //       document.getElementById('error').textContent = err.message
    //       return
    //     } else {
    //       document.getElementById('error').textContent = ''
    //     }
    //     console.log('ports', ports);
    
    //     if (ports.length === 0) {
    //       document.getElementById('error').textContent = 'No ports discovered'
    //     }
    
    //     tableHTML = tableify(ports)
    //     document.getElementById('ports').innerHTML = tableHTML
    // })
}



var device_enum = {"mc_01":50, "mc_02":51, "mc_03":52, "cp_ry_01":53, "cp_ry_02":54, "cp_ry_03":55, "r_led_01":56, "g_led_01":57, "b_led_01":58, 
        "r_led_02":59, "g_led_02":60, "b_led_02":61, "r_led_03":62, "g_led_03":63, "b_led_03":64, "fault_led":65
        }

function device_ctrl(device_id, cmd)
{
    client.writeRegister(device_id, cmd);
    console.log("device_ctrl_Success");
}

function OnConvert(doom)
    {
        hex = doom;
        hex = hex.match(/[0-9A-Fa-f]{2}/g);
        len = hex.length;
        if( len==0 ) return;
        txt='';
        for(i=0; i<len; i++)
        {
            h = hex[i];
            code = parseInt(h,16);
            t = String.fromCharCode(code);
            txt += t;
        }
        return txt;
    }

async function check_version(){
    let port = new SerialPort(Config.test.port, {
        baudRate: Config.baudrate
    });

    console.log("Test uart:", Config.test.port);

    console.log("Send Version");

    port.write('a')

    port.on('data', function (data) {
        //let txt = Buffer.from(Buffer.concat(data), 'hex').toString('ascii');
        //let txt2 = OnConvert(txt);
        
        console.log('Data:', data.toString("ascii"));
        port.close();
      })


      /*

    port.on('open', function(){
        console.log("Serial Port Open");
        port.write('a')

        port.on('data', function (data) {
            console.log("Firmware Version:", data[0]);
        })
    });

    //await DelayMs(100);

    console.log("END");

    port.close();
    */
}

async function ready_download(){
    let port = new SerialPort(Config.test.port, {
        baudRate: Config.baudrate
    });
    console.log("Test uart:", Config.test.port);

    port.write('1')

    port.on('data', function (data) {
        //let txt = Buffer.from(Buffer.concat(data), 'hex').toString('ascii');
        //let txt2 = OnConvert(txt);
        
        console.log('Data:', data.toString("ascii"));
        port.close();
      })

      /*
    port.write('1', function(err) {
        if (err) {
          return console.log('Error on write: ', err.message)
        }
        console.log('message written')
      })




    console.log("Send Ready Download");
    port.write("1");

    await DelayMs(100);

    sp.on('data', function (data) {
        console.log("Firmware Ready:", data[0]);
    })

    port.close();
*/
}


function consoleTest(){
    console.log("Test");
}

function connect_port(port_name)
{
    //connect_com_port = port_name;
}

function serial_open()
{
    selected_port = document.getElementById('port_list').value;
    console.log(document.getElementById('port_list').value);
}
 
function req_modbus() {
    // read the 2 registers starting at address 5
    // on device number 1.
    data = client.readHoldingRegisters(0, 30, function(err, data) {
        console.log("req_modbus_Success");
        document.getElementById('ch01_status').innerHTML = data.data[0];
        document.getElementById('ch01_pwm_duty').innerHTML = data.data[1];
        document.getElementById('ch01_avg_vol').innerHTML = data.data[2];
        document.getElementById('ch01_vol').innerHTML = data.data[3];
        document.getElementById('ch01_AC_vol').innerHTML = data.data[4];
        document.getElementById('ch01_AC_cur').innerHTML = data.data[5];
        document.getElementById('ch01_emg').innerHTML = data.data[6];
        document.getElementById('ch01_cp_ry').innerHTML = data.data[7];
        document.getElementById('ch01_mc').innerHTML = data.data[8];
        document.getElementById('ch01_wd').innerHTML = data.data[9];
        document.getElementById('ch02_status').innerHTML = data.data[10];
        document.getElementById('ch02_pwm_duty').innerHTML = data.data[11];
        document.getElementById('ch02_avg_vol').innerHTML = data.data[12];
        document.getElementById('ch02_vol').innerHTML = data.data[13];
        document.getElementById('ch02_AC_vol').innerHTML = data.data[14];
        document.getElementById('ch02_AC_cur').innerHTML = data.data[15];
        document.getElementById('ch02_emg').innerHTML = data.data[16];
        document.getElementById('ch02_cp_ry').innerHTML = data.data[17];
        document.getElementById('ch02_mc').innerHTML = data.data[18];
        document.getElementById('ch02_wd').innerHTML = data.data[19];
        document.getElementById('ch03_status').innerHTML = data.data[20];
        document.getElementById('ch03_pwm_duty').innerHTML = data.data[21];
        document.getElementById('ch03_avg_vol').innerHTML = data.data[22];
        document.getElementById('ch03_vol').innerHTML = data.data[23];
        document.getElementById('ch03_AC_vol').innerHTML = data.data[24];
        document.getElementById('ch03_AC_cur').innerHTML = data.data[25];
        document.getElementById('ch03_emg').innerHTML = data.data[26];
        document.getElementById('ch03_cp_ry').innerHTML = data.data[27];
        document.getElementById('ch03_mc').innerHTML = data.data[28];
        document.getElementById('ch03_wd').innerHTML = data.data[29];
    });
}

var handle = null;

function startInterval()
{
    serial_open();
    start_modbus();

    if(handle == null){
        handle = setInterval(function() {
            req_modbus();
        }, 1000);
    }
    else{
        alert("oper");
    }
}

function stopInterval()
{
    clearInterval(handle);
    handle = null;
}

/*
setInterval(function() {
    req_modbus();
}, 1000);
*/
/*
setInterval(function() {
    client.readHoldingRegisters(50, 5, function(err, data) {
        console.log(data.data);
        document.getElementById('serial_data').innerHTML = data.data;
        document.getElementById('PWM_01').innerHTML = data.data[1];
    });
}, 1000);
*/

/*
sp.on('open', function () {
    console.log('Serial Port OPEN');
    sp.on('data', function (data) {
        console.log("Valueaa Test", data[2]);

    });
});*/

// Set a timeout that will check for new serialPorts every 2 seconds.
// This timeout reschedules itself.
//setTimeout(function listPorts() {
//  abab();
//  setTimeout(listPorts, 2000);
//}, 2000);

