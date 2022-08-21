Crossmint chrome extension will 

# Get Started

### Update Config
*note: need to add enviornment variables and/or cm login*
Open `popup.js` and replace `config` with your `secret`, `projectkey`, and `projectname`.
Save.

### Load your unpacked extension
The directory holding the manifest file can be added as an extension in developer mode in its current state. To load an unpacked extension in developer mode, follow these steps:
1. Open the Extension Management page by navigating to `chrome://extensions`.
    - Alternatively, open this page by clicking on the Extensions menu button and selecting Manage Extensions at the bottom of the menu.
    - Alternatively, open this page by clicking on the Chrome menu, hovering over More Tools then selecting Extensions
2. Enable Developer Mode by clicking the toggle switch next to Developer mode.
3. Click the Load unpacked button and select the extension directory.
More information about Chrome Extensions available [here](https://developer.chrome.com/docs/extensions/mv3/getstarted/).

You may need to pin the extension to Chrome. 

### Test the extension
1. Navigate to a website with lots of images (amazon works great).
2. click the Extension

![image](https://user-images.githubusercontent.com/85324096/185813070-e9c00b63-31fb-4e30-ac01-1012adaf2ae6.png)

3. Click an image to mint an NFT

![image](https://user-images.githubusercontent.com/85324096/185813083-76b65272-8485-4690-b64a-40d2dbd99e36.png)

4. Update the name, description, etc.
5. Click "Crossmint!" 
*Note: you can right click--inspect within the extension to see the console. If you click out of the extension the inspector will disappear!*

----

TO DO: 

- Form/API Submit Validation
- Error Handling
- Incorporate environment variables
- Improve `back button` handling
- look into react chrome extensions
- add URL to final NFT
- improve spinner rendering

known issues: 

- some websites' images are masked/modified and don't end w/ standard extension 
- issue with checking mint status (returning error...some auth issue. i think b/c the format of the tx Id) (checkMintStatus)
- back button doesn't rerender the images correctly




