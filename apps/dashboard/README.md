# Client Management Web App Documentation

## Overview

Welcome to Jamphlet's Dashboard App! This web application is designed to provide users with a comprehensive overview of clients within a project, allowing for efficient management and organization. Users can add new clients, search, filter, and customize their view for a seamless experience.

## Table of Contents

- [Getting Started](#getting-started)
- [Adding New Clients](#adding-new-clients)
- [Searching and Filtering](#searching-and-filtering)
- [Dynamic Querying](#dynamic-querying)
- [Sorting and View Options](#sorting-and-view-options)
- [Client View](#client-view)
- [Editing Client Information](#editing-client-information)
- [Project Menu](#project-menu)

## Getting Started

Upon logging in, users will find the Clients menu as the central hub for managing client information within a project. The menu provides a holistic overview of all clients associated with the project.

## Adding New Clients

### Option 1: Click "New Client"
Users can easily add a new client by clicking the "New Client" button in the Clients menu.

### Option 2: Fill out the Reduced Form
Alternatively, users can quickly add a new client by filling out the reduced form located in the right panel.

## Searching and Filtering

Efficiently locate specific clients using the search bar, allowing users to filter the client list by name and email. The search functionality employs a fuzzy search algorithm implemented with the Tanstack Table library, ensuring accurate and flexible results.

## Dynamic Querying

Scroll down the client list to dynamically query more entries. This feature is made possible by the Tanstack Virtualization library, providing a smooth and responsive user experience.

## Sorting and View Options

Clicking on the three dots button reveals a menu where users can adjust sorting parameters and switch between a table view or a preview card view, offering flexibility in how clients are displayed.

## Client View

When clicking on an entry in the client list, the Client View component opens in the right panel. This view provides a detailed perspective on the selected client's information.

## Editing Client Information

Within the Client View panel, users have the capability to edit the client's information, update the personal message, and modify the client's selection, ensuring that the client database remains accurate and up-to-date.

## Project Menu
To see documentation about the project menu, click here:
https://github.com/TevinZielke/jamphlet/blob/main/apps/dashboard/app/project/README.md
