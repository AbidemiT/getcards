const query = `{
    viewer {
      login
      repositories(last: 20) {
        edges {
          node {
            description
            name
            url
            languages(first: 1) {
              edges {
                node {
                  name
                  color
                }
              }
            }
            stargazerCount
            forkCount
            updatedAt
            createdAt
            viewerHasStarred
          }
        }
      }
      avatarUrl(size: 260)
      bio
    }
    user(login: "abidemit") {
      bio
      bioHTML
      name
    }
  }`;

var key = config.GITHUB_APIKEY;
const url = `https://api.github.com/graphql`;
let user = {};

const loader = document.getElementById('loading');
const noOfRepo = document.getElementById('noOfRepo');
const repoCount = document.getElementById('repoCount');
const profileImg = document.querySelector('.profile__img');
const profileBio = document.querySelector('.profile__bio');
const fullName = document.querySelector('.profile__name--full');
const username = document.querySelector('.profile__name--username');
const repositories = document.querySelector('.repositories');

const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'April', 'May', 'June',
    'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
];


function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
    const day = date.getDate();
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    let minutes = date.getMinutes();

    if (minutes < 10) {
        // Adding leading zero to minutes
        minutes = `0${ minutes }`;
    }

    if (prefomattedDate) {
        // Today at 10:20
        // Yesterday at 10:20
        return `${ prefomattedDate }`;
    }

    if (hideYear) {
        // 10. Jan
        return `Updated on ${ day }. ${ month }`;
    }

    // 10. Jan 2017.
    return `Updated on ${ day }. ${ month } ${ year }.`;
}


// --- Main function
function timeAgo(dateParam) {
    if (!dateParam) {
        return null;
    }

    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
    const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
    const today = new Date();
    const yesterday = new Date(today - DAY_IN_MS);
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const isToday = today.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();
    const isThisYear = today.getFullYear() === date.getFullYear();


    if (seconds < 5) {
        return 'now';
    } else if (seconds < 60) {
        return `Updated ${ seconds } seconds ago`;
    } else if (seconds < 90) {
        return 'Updated a minute ago';
    } else if (minutes < 60) {
        return `Updated ${ minutes } minutes ago`;
    } else if (isToday) {
        return getFormattedDate(date, 'Updated Today'); // Today
    } else if (isYesterday) {
        return getFormattedDate(date, 'Updated Yesterday'); // Yesterday
    } else if (isThisYear) {
        return getFormattedDate(date, false, true); // 10. January
    }

    return getFormattedDate(date); // 10. January 2017.
}

// Helper function (Setattribute helper)
function setAttributes(element, attributes) {
    for (const key in attributes) {
        if (Object.hasOwnProperty.call(attributes, key)) {
            const attrValue = attributes[key];
            element.setAttribute(key, attrValue);
        }
    }
}

function displayUser() {
    profileImg.setAttribute('src', user.data.viewer.avatarUrl);
    fullName.textContent = user.data.user.name;
    username.textContent = user.data.viewer.login;
    profileBio.textContent = user.data.user.bio;
    noOfRepo.textContent = user.data.viewer.repositories.edges.length;
    repoCount.textContent = user.data.viewer.repositories.edges.length;

    user.data.viewer.repositories.edges.forEach(repo => {
        console.log(repo);
        const repositoriesList = document.createElement('li');
        const repositoriesListDetails = document.createElement('div');
        const repositoriesListStarbox = document.createElement('div');
        const repositorySub = document.createElement('div');
        const repositoriesListContent = document.createElement('div');
        const repositoryTitle = document.createElement('h3');
        const repositoriesTitleLink = document.createElement('a');
        const repositoriesSubtitle = document.createElement('p');
        const repoInfo = document.createElement('div');
        const repoColorLanguageContainer = document.createElement('div');
        const starBoxBtn = document.createElement('button');
        const starBoxBtnContent = document.createElement('span');

        const svgStarLink = document.createElement('a');
        const svgForkLink = document.createElement('a');

        const boxStarSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const boxStarPath = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        );
        const iconStarSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const iconStarPath = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        );
        const iconUnStarSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const iconUnStarPath = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        );
        const iconForkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const iconForkPath = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        );
        const svgStarFigure = document.createElement('span');
        const svgForkFigure = document.createElement('span');

        // create attributes
        setAttributes(svgStarFigure, {
            class: 'figure'
        });
        setAttributes(svgStarLink, {
            class: 'svg-star-link'
        });
        setAttributes(svgForkFigure, {
            class: 'figure'
        });
        setAttributes(svgForkLink, {
            class: 'svg-fork-link'
        });

        // Set attribute for Star svg
        setAttributes(iconStarSvg, {
            viewBox: '0 0 16 16',
            version: '1.1',
            width: '16',
            height: '16',
            'aria-hidden': 'true'
        });

        // Set attribute for Box Star svg
        setAttributes(boxStarSvg, {
            viewBox: '0 0 16 16',
            version: '1.1',
            width: '16',
            height: '16',
            'aria-hidden': 'true'
        });

        // Set attribute for UnStar svg
        setAttributes(iconUnStarSvg, {
            viewBox: '0 0 16 16',
            version: '1.1',
            width: '16',
            height: '16',
            'aria-hidden': 'true'
        });

        // Set attribute for Fork svg
        setAttributes(iconForkSvg, {
            viewBox: '0 0 16 16',
            version: '1.1',
            width: '16',
            height: '16',
            role: 'img',
            'aria-label': 'fork'
        });

        // set attribute for Star path
        setAttributes(iconStarPath, {
            'fill-rule': 'evenodd',
            d: 'M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z'
        });

        // set attribute for Box Star path
        setAttributes(boxStarPath, {
            'fill-rule': 'evenodd',
            d: 'M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z'
        });

        // set attribute for UnStar path
        setAttributes(iconUnStarPath, {
            'fill-rule': 'evenodd',
            d: 'M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z'
        });

        // set attribute for Fork path
        setAttributes(iconForkPath, {
            'fill-rule': 'evenodd',
            d: 'M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z'
        });

        const repoColorLanguage = document.createElement('span');
        const repoLanguage = document.createElement('span');
        const updated = document.createElement('span');
        setAttributes(repositoriesTitleLink, {
            href: repo.node.url,
            target: '_blank'
        });
        repositoriesTitleLink.textContent = repo.node.name;
        repositoriesSubtitle.textContent = repo.node.description;
        repositoriesList.setAttribute('class', 'repositories__list');
        starBoxBtn.setAttribute('class', 'star-box');
        starBoxBtnContent.setAttribute('class', 'star-box-content');
        repositoriesListDetails.setAttribute('class', 'repositories__list--details');
        repositoriesListStarbox.setAttribute('class', 'repositories__list--star-box');
        repositoriesListContent.setAttribute('class', 'repositories__list--content');
        repositoryTitle.setAttribute('class', 'repositories-title');
        repositoryTitle.setAttribute('class', 'repo__color-language-container');
        repositoriesTitleLink.setAttribute('class', 'repositories-title-link');
        repositoriesSubtitle.setAttribute('class', 'repositories-sub-title');
        repositorySub.setAttribute('class', 'repositories-sub');
        // repositorySub.style.width = '435px';
        repoInfo.setAttribute('class', 'repo-info');
        repoColorLanguageContainer.setAttribute('class', 'repo__color-language-container');
        updated.textContent = `${timeAgo(repo.node.updatedAt)}`;
        updated.setAttribute('class', 'updated');
        repoColorLanguage.setAttribute('class', 'repo__color-language');
        repoLanguage.setAttribute('class', 'repo__programminglanguage');

        if (repo.node.languages.edges.length > 0) {
            repoInfo.appendChild(repoColorLanguageContainer);
            repoLanguage.textContent = repo.node.languages.edges[0].node.name;
            repoColorLanguage.setAttribute('style', `background: ${repo.node.languages.edges[0].node.color}`);
        }

        // // Append
        repositories.appendChild(repositoriesList);
        repositoriesList.appendChild(repositoriesListDetails);
        repositoriesList.appendChild(repositoriesListStarbox);
        repositoriesListDetails.appendChild(repositoriesListContent);
        repositoriesListStarbox.appendChild(starBoxBtn);


        repositoriesListContent.appendChild(repositoryTitle);
        repositoryTitle.appendChild(repositoriesTitleLink);
        repositoriesListDetails.appendChild(repositorySub);
        repositoriesListDetails.appendChild(repoInfo);


        if (repo.node.stargazerCount) {
            repoInfo.appendChild(svgStarLink);
            svgStarLink.appendChild(iconStarSvg);
            svgStarLink.appendChild(svgStarFigure);
            iconStarSvg.appendChild(iconStarPath);
            svgStarFigure.textContent = repo.node.stargazerCount
        }

        if (repo.node.forkCount !== 0) {
            repoInfo.appendChild(svgForkLink);
            svgForkLink.appendChild(iconForkSvg);
            svgForkLink.appendChild(svgForkFigure);
            iconForkSvg.appendChild(iconForkPath);
            svgForkFigure.textContent = repo.node.forkCount;
        }

        if (repo.node.viewerHasStarred !== true) {
            starBoxBtn.appendChild(boxStarSvg);
            starBoxBtn.appendChild(starBoxBtnContent);
            boxStarSvg.appendChild(boxStarPath);
            starBoxBtnContent.textContent = "Star"
        } else {
            starBoxBtn.appendChild(iconUnStarSvg);
            starBoxBtn.appendChild(starBoxBtnContent);
            iconUnStarSvg.appendChild(iconUnStarPath);
            starBoxBtnContent.textContent = "Unstar"
        }
        repoColorLanguageContainer.appendChild(repoColorLanguage);
        repoColorLanguageContainer.appendChild(repoLanguage);
        repoInfo.appendChild(updated);
        repositorySub.appendChild(repositoriesSubtitle);


    });

}

async function fetchData() {
    loader.style.display = "flex";
    try {
        const data = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + key
            },
            body: JSON.stringify({
                query
            })
        })

        user = await data.json();
        loader.style.display = "none";
        displayUser();
    } catch (error) {
        return error;
    }
}

fetchData();