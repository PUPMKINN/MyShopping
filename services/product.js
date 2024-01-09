require("dotenv").config();
const Course = require("../models/Course.js");
const Review = require("../models/Review.js");
const User = require("../models/User.js");
//const uploadToCloudinary = require("../config/cloudinary.js");

const mongoose = require("mongoose");

const filteredAndSorted = async function (searchField, name, tutorName, faculty, studentCourse, average, minPrice, maxPrice, sortByField, sortByOrder) {
    const fliter = {};
    const sort = {};

    // Fliter
    fliter.status = "Available";
    if (searchField !== `None` && searchField) {
        const course = await Course.find({name: searchField});
        if(course.length>0)  fliter.name = searchField;
        else {
            const tutor = await User.find({fullname: searchField, role: "tutor"})
            if(tutor.length>0)fliter.tutor = tutor[0]._id;
        }
    }
    if (name !== `None` && name) {
        fliter.name = name;
    }
    if (tutorName !== "None" && tutorName) {
        try {
            const tutor = await User.find({fullname: tutorName, role: "tutor"})
            fliter.tutor = tutor[0]._id;

        } catch (error) {
            delete fliter.tutor;
            console.log("Tutor invalid", error);
        }
    }
    if (faculty !== `None` && faculty) {
        fliter.faculty = faculty;
    }
    if (studentCourse !== `None` && studentCourse) {
        fliter.studentCourse = studentCourse;
    }
    if(average) {
        fliter.average = average;
    }
    if (minPrice !== `None` && maxPrice !== `None` && minPrice && maxPrice) {
        minPrice = Number(minPrice);
        maxPrice = Number(maxPrice);

        if (minPrice <= maxPrice) {
            fliter.price = { $gte: minPrice, $lte: maxPrice };
        }
    }

    // Sort
    if (sortByField !== `None` && sortByField) {
        if (sortByField === 'tutor.username') {
            sort['tutor.username'] = sortByOrder === 'desc' ? -1 : 1;
        } else {
            sort[sortByField] = sortByOrder === 'desc' ? -1 : 1;
        }
    }

    try {
        const result = await Course.find(fliter).sort(sort).populate('tutor').lean();

        return result;
    } catch (error) {
        console.log("Error in PrfilteredAndSortedProducts of Product Services", error);
        throw error;
    }

}

const filteredSortedPaging = async function (searchField, name, tutorName, faculty, studentCourse,average, minPrice, maxPrice, sortByField, sortByOrder, skipAmount, pageSize) {
    const fliter = {};
    const sort = {};

    // Fliter
    fliter.status = "Available";
    if (searchField !== `None` && searchField) {
        const course = await Course.find({name: searchField});
        if(course.length>0)  fliter.name = searchField;
        else {
            const tutor = await User.find({fullname: searchField, role: "tutor"})
            //console.log(tutor); 
            if(tutor.length>0)fliter.tutor = tutor[0]._id;
        }
    }
    if (name !== `None` && name) {
        fliter.name = name;
    }
    if (tutorName !== "None" && tutorName) {
        try {
            const tutor = await User.find({fullname: tutorName, role: "tutor"})
            fliter.tutor = tutor[0]._id;

        } catch (error) {
            delete fliter.tutor;
            console.log("Tutor invalid", error);
        }
    }
    if (faculty !== `None` && faculty) {
        fliter.faculty = faculty;
    }
    if (studentCourse !== `None` && studentCourse) {
        fliter.studentCourse = studentCourse;
    }
    if(average) {
        fliter.average = average;
    }
    if (minPrice !== `None` && maxPrice !== `None` && minPrice && maxPrice) {
        minPrice = Number(minPrice);
        maxPrice = Number(maxPrice);

        if (minPrice <= maxPrice) {
            fliter.price = { $gte: minPrice, $lte: maxPrice };
        }
    }

    // Sort
    if (sortByField !== `None` && sortByField) {
        sort[sortByField] = sortByOrder === `desc` ? -1 : 1;
    }

    try {
        const result = await Course.find(fliter).sort(sort).populate('tutor').skip(skipAmount).limit(pageSize).lean();
        return result;
    } catch (error) {
        console.log("Error in PrfilteredAndSortedProducts of Product Services", error);
        throw error;
    }

}


module.exports = {
    filteredAndSorted,
    filteredSortedPaging,

}