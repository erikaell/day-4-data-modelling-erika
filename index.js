const express = require("express");

const db = require('./connection/db');

const app = express();
const PORT = 6500;

// const isLogin = true;

app.set("view engine", "hbs"); //setup template engine / view engine

// db.connect(function (err, _, done){
//   if (err) throw err;
//   console.log('Database Connection Success');
//   done();
// })

app.use("/public", express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: false }));

let projects = [];

app.get("/", (req, res) => {
  db.connect(function (err, client, done){
    if (err) throw err;

    const query = 'SELECT * FROM tb_projects';

    client.query(query, function(err,result){
      if (err) throw err;

      const projectsData = result.rows;

      const newProject = projectsData.map((project)=>{
        project.duration = getDistanceTime(project.end_date,project.start_date);
        project.icon = String(project.technologies).replace(',','');
        return project;
      });

      console.log(newProject);

      res.render("index", { projects: newProject });

    });
    done();
  });
});

app.get("/detail", (req, res) => {
  res.render("detail-projects");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

app.get("/contact-me", (req, res) => {
  res.render("contact-me");
});

app.get("/add-project", (req, res) => {
  res.render("add-project");
});

app.post("/contact-me", (req, res) => {
  const data = req.body;
  // console.log(data);

  res.redirect("/contact-me");
});

app.post("/add-project", (req, res) => {
  const data = req.body;
  // console.log(data);
  projects.push({
    name: data["name"],
    startDate: data["startDate"],
    endDate: data["endDate"],
    image: data["image"],
    description: data["description"],
    technologies: data["technologies"],
    duration: getDistanceTime(data["endDate"], data["startDate"]),
    startDateNew: getFullTime(data["startDate"]),
    endDateNew: getFullTime(data["endDate"]),
  });
  res.redirect("/");
});

app.get("/delete-project/:index", (req, res) => {
  const index = req.params.index;
  projects.splice(index, 1);

  res.redirect("/");
});

// app.get("/edit-project/:index", (req, res) => {
//   const index = req.params.index;
//   let project = projects[index];

//   res.render("edit-project", { data: index, project });
// });

app.get("/edit-project/:id", (req, res) => {
  id = req.params.id;

  projects[id].checkjs = js(projects[id].technologies);
  projects[id].checkhtml = html(projects[id].technologies);
  projects[id].checkcss = css(projects[id].technologies);
  projects[id].checkphp = php(projects[id].technologies);

  res.render("edit-project", {
    data: projects[req.params.id],
    id: req.params.id,
  });
});

app.get("/detail-project/:index", (req, res) => {
  const index = req.params.index;
  const project = projects[index];

  res.render("detail-project", { data: index, project });
});

// app.post("/edit-project/:index", (req, res) => {
//   const data = req.body;

//   projects[req.params.index] = {
//     name: data["name"],
//     startDate: data["startDate"],
//     endDate: data["endDate"],
//     image: data["image"],
//     description: data["description"],
//     technologies: data["technologies"],
//     duration: getDistanceTime(data["endDate"], data["startDate"]),
//     startDateNew: getFullTime(data["startDate"]),
//     endDateNew: getFullTime(data["endDate"])
//   };

app.post("/edit-project/:id", (req, res) => {
  const data = req.body;

  projects[req.params.id] = {
    name: data["name"],
    startDate: data["startDate"],
    endDate: data["endDate"],
    image: data["image"],
    description: data["description"],
    technologies: String(data["technologies"]).replaceAll(',',''),
    duration: getDistanceTime(data["endDate"], data["startDate"]),
    startDateNew: getFullTime(data["startDate"]),
    endDateNew: getFullTime(data["endDate"]),
  };

  console.log(projects);
  res.redirect("/");
});

const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getFullTime(time) {
  let newTime = new Date(time);
  const date = newTime.getDate();
  const monthIndex = newTime.getMonth();
  const year = newTime.getFullYear();

  const fullTime = `${date} ${month[monthIndex]} ${year}`;

  return fullTime;
}

function getDistanceTime(time1, time2) {
  const endDate = new Date(time1);
  const startDate = new Date(time2);

  const distance = endDate - startDate;

  const milisecondsInMonth = 1000 * 60 * 60 * 24 * 30;
  const distanceMonth = Math.floor(distance / milisecondsInMonth);

  if (distanceMonth >= 1) {
    return `${distanceMonth} month`;
  } else {
    const milisecondsInDay = 1000 * 60 * 60 * 24;
    const distanceDay = Math.floor(distance / milisecondsInDay);
    return `${distanceDay} day`;
  }
}

// app.get('/detail-blog/:index', (req, res) => {
//   const index = req.params.index;

//   res.render('blog-detail', { data: index, number: '2022' });
// });

// app.get('/contact', (req, res) => {
//   res.render('contact');
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port: ${PORT}`);
// });

// Backend = 5000 etc
// Frontend = 3000 etc
