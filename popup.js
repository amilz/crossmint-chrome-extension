"use strict";

//To-do: move this to a .env or have some other log-in/verification setp
const config = {
  secret: "zzzz.xxxxxx.xxxxxxxxxxxxxxxxxxxxx",
  projectKey: "xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx",
  projectName: "default",
};
//Type of extensions that will be scrubbed by the extension
const imgExtensions = ["png", "gif", "jpg"];

// DIV Definitions
const imageDiv = document.getElementById("image_div");
const mintPageDiv = document.getElementById("mint_page");
const selectedImgDiv = document.getElementById("selected_img");
const crossMintBtn = document.getElementById("crossmint_btn");
const backBtn = document.getElementById("back_btn");
const loader = document.getElementById("loader");
const resultText = document.getElementById("result");

//button functionality
backBtn.addEventListener("click", function () {
  imageDiv.innerHTML = "";
  imageDiv.style.display = "block";
  main();
  mintPageDiv.style.display = "none";
});
crossMintBtn.addEventListener("click", function () {
  mintNft();
});

//hide these divs on launch
mintPageDiv.style.display = "none";
loader.style.display = "none";

let selectedImgUrl = "";

//find all image urls on the page
function fetchPageImageUrls() {
  let images = document.querySelectorAll("img");
  let srcArray = Array.from(images).map(function (image) {
    return image.currentSrc;
  });
  return srcArray;
}

//chrome function to get the current tab
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function main() {
  console.log(`main running`);
  let currentTab = await getCurrentTab();
  console.log(`got current tab`);
  chrome.scripting.executeScript(
    {
      target: { tabId: currentTab.id },
      function: fetchPageImageUrls,
    },
    (res) => {
      let allImages = res[0].result;
      if (allImages.length < 1) return;
      //only images w/ our extensions at the end of the file path will be allowed
      allImages = allImages.filter((file) =>
        imgExtensions.includes(file.split(".").pop())
      );
      allImages.forEach((img, i) => {
        let newImage = document.createElement("img");
        newImage.src = img;
        //add a listener for each image -- TO DO clean this up a bit + global function
        newImage.addEventListener("click", function () {
          selectedImgUrl = newImage.src;
          imageDiv.style.display = "none";
          let newImgDiv = document.createElement("div");
          newImgDiv.className = "selectedSquare";
          newImgDiv.appendChild(newImage);
          selectedImgDiv.replaceChildren(newImgDiv);
          mintPageDiv.style.display = "block";
        });
        let newDiv = document.createElement("div");
        newDiv.className = "square";
        newDiv.appendChild(newImage);
        imageDiv.appendChild(newDiv);
      });
    }
  );
}
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function mintNft() {
  mintPageDiv.style.display = "none";
  loader.style.display = "block";
  const reqHeader = new Headers();
  reqHeader.append("x-client-secret", config.secret);
  reqHeader.append("x-project-id", config.projectKey);
  reqHeader.append("Content-Type", "application/json");

  const chain = document.querySelector("#chain").value; // sol or poly
  const recipient = "email:" + document.querySelector("#destination").value;

  const reqBody = JSON.stringify({
    mainnet: false,
    metadata: {
      name: document.querySelector("#nftName").value,
      image: selectedImgUrl,
      description: document.querySelector("#nftDescription").value,
    },
    recipient: recipient + ":" + chain, //format: email:<addy>.chain
  });

  var requestOptions = {
    method: "POST",
    headers: reqHeader,
    body: reqBody,
    redirect: "follow",
  };
  fetch(
    `https://staging.crossmint.io/api/2022-06-09/minting/collections/${config.projectName}/nfts`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      //let crossMintId = JSON.parse(result).id;
      //checkMintStatus(crossMintId);
      onComplete("successfully submitted");
    })
    .catch((error) => {
      onComplete("error submitting to crossmint");
      console.log("error", error);
    });
}

function onComplete(result) {
  loader.style.display = "none";
  resultText.innerHTML = result;
}

//disabled--need to troubleshoot--some permissions issue on callback
async function checkMintStatus(mintId) {
  console.log("check Mint status of: ", mintId);
  let complete = false;

  function onComplete(result) {
    complete = true;
    loader.style.display = "none";
    resultText.innerText(result);
  }
  let retryCount = 1;
  while (!complete) {
    console.log("checking mint status: ", retryCount);
    const reqHeader = new Headers();
    reqHeader.append("x-client-secret", config.secret);
    reqHeader.append("x-project-id", config.projectKey);

    const requestOptions = {
      method: "GET",
      headers: reqHeader,
      redirect: "follow",
    };

    fetch(
      `https://www.crossmint.io/api/2022-06-09/collections/${config.projectName}/nfts/${mintId}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        if (result.onChain.status === "success") {
          onComplete("success!");
        }
      })
      .catch((error) => {
        onComplete("error");
        console.log("error", error);
      });
    retryCount++;
    await sleep(5000);
  }
}

main();