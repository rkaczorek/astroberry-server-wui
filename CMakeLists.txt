cmake_minimum_required(VERSION 2.8)
PROJECT(astroberry-server-wui NONE)

set (VERSION_MAJOR 2)
set (VERSION_MINOR 0)
set (VERSION_RELEASE 0)

configure_file(${CMAKE_CURRENT_SOURCE_DIR}/files/astroberry.version.cmake ${CMAKE_CURRENT_BINARY_DIR}/astroberry.version)

set(NGINX_INSTALL_DIR "/etc/nginx")
set(SSL_INSTALL_DIR "/etc/ssl")
set(WWW_INSTALL_DIR "/var/www")
set(SYSTEMD_INSTALL_DIR "/etc/systemd/system")

message("=========================================== $ENV{DESTDIR}/${BUILD_ROOT} ==============================================")

if (${CMAKE_SYSTEM_NAME} MATCHES "Linux")
	install(FILES ${CMAKE_CURRENT_SOURCE_DIR}/files/astroberry DESTINATION ${NGINX_INSTALL_DIR}/sites-available)
        install(FILES ${CMAKE_CURRENT_SOURCE_DIR}/files/astroberry_ssl DESTINATION ${NGINX_INSTALL_DIR}/sites-available)
	install(FILES ${CMAKE_CURRENT_SOURCE_DIR}/files/astroberry.crt DESTINATION ${SSL_INSTALL_DIR})
	install(FILES ${CMAKE_CURRENT_SOURCE_DIR}/files/astroberry.key DESTINATION ${SSL_INSTALL_DIR})
        install(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/files/html DESTINATION ${WWW_INSTALL_DIR})
	install(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/files/gpspanel DESTINATION ${WWW_INSTALL_DIR})
	install(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/files/vnc DESTINATION ${WWW_INSTALL_DIR})
        install(FILES ${CMAKE_CURRENT_SOURCE_DIR}/files/gpspanel.service DESTINATION ${SYSTEMD_INSTALL_DIR})
        install(FILES ${CMAKE_CURRENT_SOURCE_DIR}/files/indiwebmanager.service DESTINATION ${SYSTEMD_INSTALL_DIR})
        install(FILES ${CMAKE_CURRENT_SOURCE_DIR}/files/novnc.service DESTINATION ${SYSTEMD_INSTALL_DIR})
	install(FILES ${CMAKE_CURRENT_BINARY_DIR}/astroberry.version DESTINATION /etc)
endif()
