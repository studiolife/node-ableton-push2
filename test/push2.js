var ableton = require('../');
var expect = require('chai').expect;

describe('Push2',()=>{
  var push2 = null;
  var isVirtual;
  try { // Try first connecting to actual Push 2
    push2 = new ableton.Push2('user');
    console.log("Running tests against connected Push 2.");
  } catch(e) {
    if (e.message.startsWith('No MIDI input found')) {
      console.log("No Ableton Push 2 found. Running tests against VirtualResponder.");
      push2 = new ableton.Push2('user',virtual=true);
      var responder = new ableton.VirtualResponder('user');
      responder.listen();
    }
  }
  describe('getDeviceInfo',()=>{
    it('should get device identity response',()=>{
      return push2.getDeviceInfo().then((resp)=>{
        expect(resp).to.have.property('firmwareVersion','1.0');
        expect(resp).to.have.property('softwareBuild',60);
        expect(resp).to.have.property('boardRevision',1);
        if (isVirtual) expect(resp).to.have.property('serialNumber',17387450);
        else expect(resp).to.have.property('serialNumber');
        expect(resp).to.have.property('deviceFamilyCode',6503);
        expect(resp).to.have.property('deviceFamilyMemberCode', 2);
      });
    });
  });
  describe('setAftertouchMode',()=>{
    it('should set aftertouch mode to "poly".',()=>{
      return push2.setAftertouchMode('poly');
    });
  });
  describe('getAftertouchMode',()=>{
    it('should get aftertouch mode, should be "poly" or "channel".',()=>{
      return push2.getAftertouchMode().then((mode)=>{
        expect(mode).to.be.a('string');
        // expect(mode).to.be.oneOf(['poly','channel']);
        expect(mode).to.be.equal('poly');
      });
    });
  });
  describe('getTouchStripConfiguration/setTouchStripConfiguration',()=>{
    it('should set touch strip configuration to all 0s, '+
        'then turn on "LEDsControlledByHost", then set back to original setting.',()=>{
      var origSetting=null;
      return push2.getTouchStripConfiguration().then((conf)=>{
        origSetting = conf.getByteCode();
        return push2.setTouchStripConfiguration(0).then((conf)=>{
          expect(conf).to.have.property('LEDsControlledByHost',0);
          expect(conf).to.have.property('hostSendsSysex',0);
          expect(conf).to.have.property('valuesSentAsModWheel',0);
          expect(conf).to.have.property('LEDsShowPoint',0);
          expect(conf).to.have.property('barStartsAtCenter',0);
          expect(conf).to.have.property('doAutoReturn',0);
          expect(conf).to.have.property('autoReturnToCenter',0);
        });
      }).catch((err)=>{
        throw new Error("Error setting touch strip configuration to 0s.");
      }).then(()=>{
        return push2.setTouchStripConfiguration({'LEDsControlledByHost':1}).then((conf)=>{
          expect(conf).to.have.property('LEDsControlledByHost',1);
          expect(conf).to.have.property('hostSendsSysex',0);
          expect(conf).to.have.property('valuesSentAsModWheel',0);
          expect(conf).to.have.property('LEDsShowPoint',0);
          expect(conf).to.have.property('barStartsAtCenter',0);
          expect(conf).to.have.property('doAutoReturn',0);
          expect(conf).to.have.property('autoReturnToCenter',0);
        });
      }).catch((err)=>{
        throw new Error("Error setting touch strip back to original setting.");
      }).then(()=>{
        return push2.setTouchStripConfiguration(origSetting).then((conf)=>{
          expect(conf.getByteCode()).to.equal(origSetting);
        });
      }).catch((err)=>{
        throw new Error("Error setting touch strip back to original setting.");
      });
    });
  });
  describe('getGlobalLEDBrightness/setGlobalLEDBrightness',()=>{
    it('should get display brightness, set it to 37, '+
        'validate, then set it back to original value', ()=>{
      var origVal = null;
      return push2.getGlobalLEDBrightness().then((val)=>{
          expect(val).to.be.a('number');
          origVal = val;
          return this;
        }).then(()=>{
          return push2.setGlobalLEDBrightness(37);
        }).then(()=>{
          return push2.getGlobalLEDBrightness();
        }).then((newVal)=>{
          expect(newVal).to.equal(37);
          return push2.setGlobalLEDBrightness(origVal);
        });
    });
  });
  describe('getDisplayBrightness/setDisplayBrightness',()=>{
    it('should get display brightness, set it to 137, '+
        'validate, then set it back to original value', ()=>{
      var origVal = null;
      return push2.getDisplayBrightness().then((val)=>{
          expect(val).to.be.a('number');
          origVal = val;
          return this;
        }).then(()=>{
          return push2.setDisplayBrightness(137);
        }).then(()=>{
          return push2.getDisplayBrightness();
        }).then((newVal)=>{
          expect(newVal).to.equal(137);
          return push2.setDisplayBrightness(origVal);
        });
    });
  });
  describe('getMidiMode',()=>{
    it('should set midi mode to "user".',()=>{
      return push2.setMidiMode('user');
    });
  });
  describe('reapplyColorPalette',()=>{
    it('should send reapply color palette command.',()=>{
      return push2.reapplyColorPalette();
    });
  });
});