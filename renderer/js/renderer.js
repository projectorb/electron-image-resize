
const form = document.querySelector('#img-form');
const img = document.querySelector("#img");
const outputPath = document.querySelector("#output-path");
const filename = document.querySelector("#filename");
const heightInput = document.querySelector("#height");
const widthInput = document.querySelector("#width");

function loadImage(e) {	
	const file = e.target.files[0]

	if (!isFileImage(file)) {
		alertError('Not Valid Image');
		return;
	}

	// get original dimension
	const image = new Image();
	image.src = URL.createObjectURL(file)
	image.onload = function() {
		widthInput.value = this.width;
		heightInput.value = this.height;
	}

	form.style.display = 'block';
	filename.innerText = file.name;
	outputPath.innerText = path.join(os.homedir(), 'imageresize');
}

function sendImage(e) {
	e.preventDefault()

	const width = widthInput.value;
	const height = heightInput.value;
	const imgPath = img.files[0].path;

	if (!img.files[0]) return alertError('Please Upload Image') ;
	if (!width || !height) return alertError('Please set Size');

	// send to main using IPC Renderer
	ipcRenderer.send("image:resize", {
    imgPath,
    width,
    height,
  });

}
// recieve responce
ipcRenderer.on('image:done', function () {
	alertSuccess(`Image Saved! resized to ${widthInput.value} x ${heightInput.value}`);
})

function isFileImage(file) {
	const acceptedImageType = ['image/gif', 'image/png', 'image/jpeg'];
	return file && acceptedImageType.includes(file['type']);
}

function alertError(message) {
	Toastify.toast(
		{
			text: message,
			duration: 5000,
			close: false,
			style: {
				background: 'red',
				color: 'white',
				textAlign: 'center',
			}
		}
	);
}

function alertSuccess(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: "green",
      color: "white",
      textAlign: "center",
    },
  });
}
img.addEventListener('change', loadImage)

form.addEventListener('submit', sendImage)