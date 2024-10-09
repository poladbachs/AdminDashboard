# DEC Energy Landing Page

## Project Overview

**DEC Energy Landing Page** is a dynamic web application built with **Next.js**. This application provides users with an intuitive interface for viewing and managing logs across different company modules (e.g., **Django**, **Website**, **Database**). The project demonstrates the use of **Next.js** for server-side rendering, **React** for state management, and **Material UI (MUI)** and **Tailwind CSS** for responsive, modern design. It fetches real-time data with **Axios** from a custom API endpoint and displays it in an organized table with sortable columns and easy navigation between modules.

## Features

- **Module Navigation**: Switch between viewing logs for specific modules using a sidebar.
- **Date Sorting**: Sort log entries by date to view either the latest or oldest entries.
- **Server and Author Filtering**: Filter logs by server type and sort by author in alphabetical order.
- **Dynamic Log Display**: Log data is displayed in a table format, with columns for date, time, server, author, current hash, and previous hash.
- **Loading State**: A loading indicator is displayed with a corresponding message while data is being fetched.
- **Error Handling**: Displays an error message if log data is empty, tailored to the selected server and module.

## Demo

A demo video showcases key features of the **DEC Energy Landing Page**, including module navigation, log filtering, and sorting options for a streamlined log viewing experience.

![dec-landing](https://github.com/user-attachments/assets/cf527a1b-0469-436f-b82f-fb0b7cc8575e)

## Technologies Used

- **React.js** and **Next.js** for component-based architecture and server-side rendering.
- **TypeScript** for type-safe coding and improved maintainability.
- **Material UI (MUI)** and **Tailwind CSS** for a modern, responsive UI design.
- **Axios** for handling HTTP requests, specifically in server-side data fetching with Next.js.

## What I Did in This Project

In the **DEC Energy Landing Page** project, I implemented:

- **Server-Side Data Fetching with Axios**:
  - Leveraged **Next.js** server-side features to fetch data from an API using **Axios**, ensuring optimized performance.
  
- **Component-Based Layout**:
  - Built reusable components such as `Sidebar`, `Dashboard`, and `Filters` for modular and maintainable code, rather than stacking everything within a single page component.
  
- **Data Filtering and Sorting**:
  - Enabled filtering of log entries by date, server type, and author.
  - Added date and author sorting options to customize the log viewing experience.
  
- **Dynamic and Interactive UI**:
  - Used **MUI** and **Tailwind CSS** for flexible styling to create a visually appealing and responsive interface.
  - Developed an interactive sidebar for easy module selection, improving navigation and user experience.
  
- **User Feedback**:
  - Implemented loading state messaging and error handling to inform users about data-fetching statuses or issues.

## Conclusion

This project demonstrates advanced usage of **Next.js**, **React**, and modern UI libraries to build a feature-rich and highly interactive web application. The DEC Energy Landing Page serves as a practical example of creating scalable and user-friendly applications that are both responsive and visually appealing.
