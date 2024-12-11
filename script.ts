declare const html2pdf : any


// Initialization
const form = document.getElementById("resumeForm") as HTMLFormElement
const resumePage = document.getElementById("r-page") as HTMLElement
const resume_photo = document.getElementById("r-img") as HTMLImageElement
const resume_name1 = document.getElementById("resume-name") as HTMLHeadingElement
const resume_email = document.getElementById("resume-email") as HTMLParagraphElement
const resume_phone = document.getElementById("resume-tel") as HTMLParagraphElement
const resume_education = document.getElementById("resume-edu") as HTMLParagraphElement
const resume_work_ex = document.getElementById("resume-work") as HTMLParagraphElement
const resume_skills = document.getElementById("resume-skills") as HTMLParagraphElement
const editBtn = document.getElementById("edit") as HTMLButtonElement
const backBtn = document.getElementById("back") as HTMLButtonElement
const shareBtn = document.getElementById("share") as HTMLButtonElement;
const downloadBtn = document.getElementById("pdf") as HTMLButtonElement
const resumeContent = document.getElementById("r-content") as HTMLDivElement


// submit action
form.addEventListener("submit" , async (event:Event) => {
    event.preventDefault()

// receiving data from form
const name = (document.getElementById("fname") as HTMLInputElement).value
const email = (document.getElementById("eml") as HTMLInputElement).value
const phone = (document.getElementById("num") as HTMLInputElement).value
const degree = (document.getElementById("dgre") as HTMLInputElement).value
const education = (document.getElementById("sch") as HTMLInputElement).value
const workExperience = (document.getElementById("dtls") as HTMLTextAreaElement).value
const Skills = (document.getElementById("skil") as HTMLTextAreaElement).value
const photoInput = document.getElementById("photo") as HTMLInputElement


// Photo work
const photoFile = photoInput.files? photoInput.files[0] : null;
let photoBase64 = '';

if(photoFile){
    photoBase64 = await fileToBase64(photoFile)

    localStorage.setItem("r-img" , photoBase64)
    resume_photo.src = photoBase64
}


// form to result transition
document.querySelector(".container")?.classList.add("hidden");
resumePage.classList.remove("hidden");


// compilation of resume info
resume_name1.textContent = name
resume_email.textContent = `Email : ${email}`
resume_phone.textContent = `Phone : ${phone}`
resume_education.textContent = `${degree} from ${education}`
resume_work_ex.textContent = workExperience
resume_skills.textContent = Skills


// share link button
const queryParams = new URLSearchParams({
    name: name,
    email : email,
    phone : phone,
    degree : degree,
    edu : education,
    work_ex : workExperience,
    skills : Skills
})

const uniqueURL = `${window.location.origin}?${queryParams.toString()}`;
shareBtn.addEventListener("click" , () => {
    navigator.clipboard.writeText(uniqueURL);
    alert("Link has been copied")
})

window.history.replaceState(null,'',`${queryParams.toString()}`)


})


// used to shorten photo url
function fileToBase64(file:File) : Promise<string> {
    return new Promise((resolve , reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve (
            reader.result as string
    )
    reader.onerror = reject;
    reader.readAsDataURL(file);
    })
}

editBtn.addEventListener("click" , () => {
    updateFormFromResume()

    document.querySelector(".container")?.classList.remove("hidden");
    resumePage.classList.add("hidden")
})

// edit button functionality

function updateFormFromResume() {
    const [degree, education] = resume_education.textContent?.split("from") || '';
    (document.getElementById("fname") as HTMLInputElement).value = resume_name1.textContent || '';
    (document.getElementById("eml") as HTMLInputElement).value = resume_email.textContent?.replace('Email : ', '') || '';
    (document.getElementById("num") as HTMLInputElement).value = resume_phone.textContent?.replace('Phone : ', '') || '';
    (document.getElementById("dgre") as HTMLInputElement).value = degree || '';
    (document.getElementById("sch") as HTMLInputElement).value = education?.trim() || '';
    (document.getElementById("dtls") as HTMLTextAreaElement).value = resume_work_ex.textContent || '';
    (document.getElementById("skil") as HTMLTextAreaElement).value = resume_skills.textContent || '';
}


// Download button functionality
downloadBtn.addEventListener("click" , () => {
    if (typeof html2pdf === 'undefined'){
        alert('Error : html2pdf library not found')
        return;
    }


const resumeOptions = {
    margin:0.5,
    filename: 'resume.pdf',
    image: {type: 'jpeg' , quality:1.0},
    html2canvas: {scale:2},
    jsPDF:{unit:'in', format:"letter", orientation:'portrait'}
}

html2pdf()
    .from(resumeContent)
    .set(resumeOptions)
    .save()
    .catch((error:Error)=> {
        console.log('PDF error' , error)
    })

})

window.addEventListener('DOMContentLoaded' , () => {
    const params = new URLSearchParams(window.location.search)
    const name = params.get("fname") || '';
    const email = params.get("eml") || '';
    const phone = params.get("num") || '';
    const degree = params.get("dgre") || '';
    const education = params.get("sch") || '';
    const workExperience = params.get("dtls") || '';
    const skills = params.get("skil") || '';

    if (name || email || phone || education || degree || workExperience || skills) {
resume_name1.textContent = name
resume_email.textContent = `Email : ${email}`
resume_phone.textContent = `Phone : ${phone}`
resume_education.textContent = `${degree} from ${education}`
resume_work_ex.textContent = workExperience;
resume_skills.textContent = skills

const savePhoto = localStorage.getItem("resumePhoto")
if(savePhoto){
    resume_photo.src =  savePhoto
}

    }
});

resume_photo.style.width = "150px";
resume_photo.style.height = "150px";
resume_photo.style.objectFit = "cover";
resume_photo.style.borderRadius = "50%";
resume_photo.style.display = "block";
resume_photo.style.margin = "0 auto";